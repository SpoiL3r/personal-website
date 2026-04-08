/**
 * /api/holidays — returns public and bank holidays for the current IST year.
 *
 * Sources (fetched in parallel):
 *   1. Nager.Date API  — India-wide public holidays (national + gazetted).
 *      Endpoint: https://date.nager.at/api/v3/PublicHolidays/{year}/IN
 *   2. RBI Bengaluru holiday matrix — bank holidays specific to Bengaluru.
 *      This is a legacy ASP.NET WebForms page that requires a multi-step POST
 *      flow: first GET the page to extract ASP.NET hidden fields (__VIEWSTATE,
 *      __VIEWSTATEGENERATOR, __EVENTVALIDATION), then POST once per month (12
 *      requests, fanned out with Promise.all) with drMonth / drYear params.
 *
 * Response shape:
 *   { year, dates: string[], holidays: HolidayRecord[], sources: [...], error? }
 *   `dates` is a deduplicated, sorted array of YYYY-MM-DD strings — the only
 *   field the ProfileStatus component actually consumes.
 *
 * Cache: revalidated every 43200 s (12 hours) via Next.js fetch revalidation.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 43200; // 12 hours — holiday data changes rarely

/** Minimal shape of a single holiday returned by the Nager.Date API. */
interface NagerHoliday {
  date?: string;
  name?: string;
  localName?: string;
}

/** Normalised holiday record used internally before building the response. */
interface HolidayRecord {
  /** ISO-8601 date (YYYY-MM-DD). */
  date: string;
  name: string;
  /** Human-readable source label included in the response for debugging. */
  source: string;
}

const RBI_HOLIDAY_URL = "https://www.rbi.org.in/scripts/HolidayMatrixDisplay.aspx?regoff=Bengaluru";

/**
 * Extracts a single ASP.NET hidden-field value from an HTML page.
 * Matches the pattern:  name="FIELD_NAME" ... value="VALUE"
 * Returns an empty string when the field is not found (safe to pass to URLSearchParams).
 */
function extractHiddenField(html: string, name: string) {
  // Regex: find the input tag by name attribute, then capture its value attribute.
  const match = html.match(new RegExp(`name="${name}"[^>]*value="([^"]*)"`, "i"));
  return match?.[1] ?? "";
}

/**
 * Parses a single RBI monthly holiday table HTML response into an array of
 * YYYY-MM-DD date strings.
 *
 * The RBI page renders a <table class="tablebgforholiday"> where the first
 * <span class="dop_header"> contains "MonthName YYYY" and subsequent spans
 * contain day-of-month integers for each holiday in that month.
 *
 * Parsing strategy:
 *   1. Extract the table via regex (the page has no stable element IDs).
 *   2. Collect all dop_header spans — first is the month/year, rest are days.
 *   3. Parse "MonthName YYYY" with a simple word/digit regex to get month index + year.
 *   4. Map day numbers to zero-padded YYYY-MM-DD strings.
 */
function parseRbiMonthDates(html: string) {
  // Match the holiday table — class name used as a stable selector.
  const tableMatch = html.match(/<table[^>]*class="tablebgforholiday"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [] as string[];

  // Each header span is either "Month YYYY" (first) or a day number (rest).
  const headerMatches = Array.from(tableMatch[1].matchAll(/<span class="dop_header">([^<]+)<\/span>/g))
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));

  const [monthLabel, ...dayLabels] = headerMatches;
  if (!monthLabel) return [];

  // Pattern: "April 2026" → capture alphabetic month name + 4-digit year.
  const monthParts = monthLabel.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!monthParts) return [];

  // Map English month name to 0-based index; return empty on unknown month.
  const monthIndex = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(monthParts[1]);
  if (monthIndex === -1) return [];

  const year = Number(monthParts[2]);
  const month = monthIndex + 1; // Convert to 1-based for ISO date building

  return dayLabels
    .map((dayLabel) => Number(dayLabel))
    .filter((day) => Number.isInteger(day) && day > 0) // discard non-numeric cells
    .map((day) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
}

/** Fetches India-wide public holidays from the Nager.Date REST API. */
async function getIndiaPublicHolidays(year: number) {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Holiday API returned ${res.status}`);
  }

  const data = (await res.json()) as NagerHoliday[];

  return data
    .filter((holiday) => typeof holiday.date === "string")
    .map((holiday): HolidayRecord => ({
      date: holiday.date as string,
      name: holiday.localName || holiday.name || "Public holiday",
      source: "India public holiday",
    }));
}

/**
 * Fetches Bengaluru-specific bank holidays from the RBI holiday matrix page.
 *
 * The RBI page is a WebForms application that requires:
 *   Step 1 — GET the page to harvest ASP.NET ViewState / EventValidation tokens.
 *   Step 2 — POST once per month (12 parallel requests) with the token payload plus
 *             drRegionalOffice=3 (Bengaluru) and drMonth=1..12.
 *
 * The drRegionalOffice value "3" corresponds to the Bengaluru regional office
 * in the RBI dropdown (hardcoded; verify if the site updates its office numbering).
 */
async function getBengaluruBankHolidays(year: number) {
  // Step 1: load the page to get ASP.NET hidden fields needed for the POST.
  const initialResponse = await fetch(RBI_HOLIDAY_URL, {
    next: { revalidate },
  });

  if (!initialResponse.ok) {
    throw new Error(`RBI holiday page returned ${initialResponse.status}`);
  }

  const initialHtml = await initialResponse.text();
  // Extract the three ASP.NET ViewState tokens required to submit the form.
  const viewState = extractHiddenField(initialHtml, "__VIEWSTATE");
  const viewStateGenerator = extractHiddenField(initialHtml, "__VIEWSTATEGENERATOR");
  const eventValidation = extractHiddenField(initialHtml, "__EVENTVALIDATION");

  // Step 2: fire 12 POST requests in parallel — one per calendar month.
  const monthResponses = await Promise.all(
    Array.from({ length: 12 }, (_, index) => {
      const body = new URLSearchParams({
        __EVENTTARGET: "",
        __EVENTARGUMENT: "",
        __LASTFOCUS: "",
        __VIEWSTATE: viewState,
        __VIEWSTATEGENERATOR: viewStateGenerator,
        __EVENTVALIDATION: eventValidation,
        drRegionalOffice: "3", // "3" = Bengaluru regional office
        drMonth: String(index + 1), // 1-based month number
        drYear: String(year),
        btnGo: "GO",
      });

      return fetch(RBI_HOLIDAY_URL, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        next: { revalidate },
      });
    }),
  );

  const htmlPages = await Promise.all(
    monthResponses.map(async (response) => {
      if (!response.ok) {
        throw new Error(`RBI holiday page returned ${response.status}`);
      }

      return response.text();
    }),
  );

  return Array.from(
    new Set(
      htmlPages.flatMap((htmlPage) => parseRbiMonthDates(htmlPage)),
    ),
  ).map((date): HolidayRecord => ({
    date,
    name: "Bengaluru bank holiday",
    source: "RBI Bengaluru bank holiday",
  }));
}

/**
 * GET handler — fetches both holiday sources in parallel and returns a merged,
 * deduplicated list. The current year is always derived from IST so the
 * correct year is used even around the UTC midnight / IST midnight gap.
 */
export async function GET() {
  // Derive the current year in IST so we don't accidentally fetch last year's
  // holidays for the 5.5 hours each day when UTC date < IST date.
  const currentYear = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
  }).format(new Date());
  const year = Number(currentYear);

  try {
    const [indiaPublicHolidays, bengaluruBankHolidays] = await Promise.all([
      getIndiaPublicHolidays(year),
      getBengaluruBankHolidays(year),
    ]);
    const holidays = [...indiaPublicHolidays, ...bengaluruBankHolidays];
    const dates = Array.from(new Set(holidays.map((holiday) => holiday.date))).sort();

    return NextResponse.json({
      year,
      dates,
      holidays,
      sources: [
        {
          name: "Nager.Date India public holidays",
          url: `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`,
        },
        {
          name: "RBI Bengaluru holiday matrix",
          url: RBI_HOLIDAY_URL,
        },
      ],
    });
  } catch (error) {
    return NextResponse.json({
      year,
      dates: [],
      holidays: [],
      sources: [
        {
          name: "Nager.Date India public holidays",
          url: `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`,
        },
        {
          name: "RBI Bengaluru holiday matrix",
          url: RBI_HOLIDAY_URL,
        },
      ],
      error: error instanceof Error ? error.message : "Failed to load holiday data",
    });
  }
}
