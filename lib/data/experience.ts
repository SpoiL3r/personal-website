/**
 * @file experience.ts
 * @description Static data for the professional experience and education sections.
 *
 * Defines the `Job` interface (used by ExperienceTimeline) and two ordered
 * arrays of entries: professional roles and academic qualifications.
 *
 * Exports:
 *  - `Job`        — shape of a single timeline entry
 *  - `EXPERIENCE` — ordered list of professional roles (newest first)
 *  - `EDUCATION`  — ordered list of academic qualifications (newest first)
 */

/**
 * Represents a single entry on the experience or education timeline.
 *
 * @property company    - Organisation or institution name.
 * @property role       - Job title or degree name.
 * @property period     - Human-readable date range (e.g. "Oct 2024 → Present").
 * @property location   - City and country.
 * @property highlights - Bullet-point achievements rendered under the card.
 * @property tags       - Technology or skill tags shown as chips.
 * @property accent     - CSS colour string used for the timeline indicator and tag highlights.
 * @property logo       - Square logo URL rendered in place of the timeline dot.
 */
export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights?: string[];
  tags?: string[];
  accent?: string;
  /** Square logo URL — rendered in place of the timeline dot */
  logo?: string;
}

/**
 * Professional work history, listed in reverse-chronological order.
 *
 * Each entry maps directly to a card rendered by `ExperienceTimeline`.
 */
export const EXPERIENCE: Job[] = [
  {
    company: "SAP Labs India",
    role: "Software Developer",
    period: "Oct 2024 → Present",
    location: "Bengaluru, India",
    accent: "#00c9b1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    highlights: [
      "Improved data retrieval performance by reworking fetch logic and adding paginated REST and OData endpoints for large datasets",
      "Introduced a caching layer for read-heavy enterprise data, reducing latency and lowering database load",
      "Built a document service for rich text and image-heavy PDFs with attention to concurrency and memory usage",
      "Worked on data replication and programmatic migration across multi-tenant landscapes, with attention to consistency, tenant isolation, and cross-landscape data movement",
    ],
    tags: ["Java 21", "Spring Boot", "SAP CAP", "OData", "HANA", "Redis", "Cloud Foundry", "Multi-tenant Systems"],
  },
  {
    company: "SAP SE",
    role: "Software Developer (Mar 2023 → Oct 2024) · Associate Software Developer",
    period: "Apr 2021 → Oct 2024",
    location: "St. Leon-Rot, Germany",
    accent: "#a78bfa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    highlights: [
      "Delivered core product features by building REST APIs and improving database design for a document management platform",
      "Worked with international teams on a shared communication library for service discovery and secure identity propagation across microservices",
      "Added fault-tolerant patterns such as circuit breakers and retries for critical cross-datacenter calls",
      "Helped improve JUnit and integration testing practices, contributing to a more stable release cycle",
    ],
    tags: ["Java", "Spring Boot", "REST", "HANA", "MySQL", "JUnit", "Cloud Foundry", "UI5"],
  },
  {
    company: "Daimler AG",
    role: "Student Intern",
    period: "Jan 2020 → Jul 2020",
    location: "Stuttgart, Germany",
    accent: "#60a5fa",
    logo: "https://www.google.com/s2/favicons?domain=mercedes-benz.com&sz=128",
    highlights: [
      "Evaluated an integration approach for long-term digital archiving across legacy storage systems, with a focus on retrieval latency",
    ],
    tags: ["Integration", "Legacy Systems"],
  },
  {
    company: "GlobalLogic",
    role: "Associate Analyst",
    period: "Aug 2016 → Sep 2017",
    location: "Gurgaon, India",
    accent: "#6b7280",
    logo: "https://www.google.com/s2/favicons?domain=globallogic.com&sz=128",
    highlights: [
      "Supported ML initiatives by improving data-validation workflows used to prepare verified training datasets",
    ],
    tags: ["Data Validation", "ML Ops"],
  },
];

/**
 * Academic qualifications, listed in reverse-chronological order.
 *
 * Reuses the `Job` type — `highlights` is omitted for education entries
 * since degree cards show tags instead of bullet points.
 */
export const EDUCATION: Job[] = [
  {
    company: "SRH Hochschule Heidelberg",
    role: "M.Sc. Applied Computer Science",
    period: "Oct 2018 → Dec 2020",
    location: "Heidelberg, Germany",
    accent: "#f59e0b",
    logo: "https://www.google.com/s2/favicons?domain=hochschule-heidelberg.de&sz=128",
    tags: ["System Design", "Application Programming", "Distributed Systems", "Databases"],
  },
  {
    company: "Dr. APJ Abdul Kalam Technical University",
    role: "B.Tech, Computer Science and Engineering",
    period: "Jun 2012 → Jun 2016",
    location: "Greater Noida, India",
    accent: "#3b82f6",
    logo: "/logos/aktu.png",
    tags: ["Data Structures", "Algorithms", "Databases"],
  },
];
