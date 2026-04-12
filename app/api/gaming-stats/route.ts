import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

// Games to pull from Steam (appid → display config)
const STEAM_APPS = [
  { id: 730,     name: "Counter-Strike 2",    short: "CS2",     color: "#f0a818" },
  { id: 1172470, name: "Apex Legends",        short: "APEX",    color: "#e64539" },
  { id: 578080,  name: "PUBG: BATTLEGROUNDS", short: "PUBG",    color: "#f5a623" },
  { id: 2767030, name: "Marvel Rivals",       short: "RIVALS",  color: "#ffb800" },
  { id: 444090,  name: "Paladins",            short: "PALADINS", color: "#a259ff" },
];

// Manual overrides for games whose APIs don't expose reliable hours
// Update OW2 manually when needed
const MANUAL_GAMES = [
  {
    name: "Overwatch 2",
    short: "OW2",
    color: "#fa9c1e",
    hours: 850,
    iconUrl: "https://www.google.com/s2/favicons?domain=overwatch.blizzard.com&sz=128",
  },
  {
    name: "Valorant",
    short: "VAL",
    color: "#ff4655",
    hours: 224,
    iconUrl: "https://www.google.com/s2/favicons?domain=playvalorant.com&sz=128",
  },
];

async function getSteamHours() {
  // include_played_free_games=1 is required, otherwise free-to-play titles
  // (Paladins, Marvel Rivals, Apex, etc.) are silently excluded.
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=1&format=json`;
  // 1h cache so newly-played games show up the same day
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  const games: { appid: number; playtime_forever: number; img_icon_url?: string }[] =
    data?.response?.games ?? [];

  // Keep every configured game whose appid Steam returned, even if playtime is 0.
  // Drop only games Steam doesn't list at all (i.e. not owned on this account).
  return STEAM_APPS
    .map((app) => {
      const game = games.find((g) => g.appid === app.id);
      if (!game) return null;
      const hours = Math.round((game.playtime_forever ?? 0) / 60);
      const iconUrl = game.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${app.id}/${game.img_icon_url}.jpg`
        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${app.id}/capsule_184x69.jpg`;
      return { ...app, hours, iconUrl };
    })
    .filter((g): g is NonNullable<typeof g> => g !== null);
}

export async function GET(req: Request) {
  if (!rateLimit(getClientIp(req), 60)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!STEAM_API_KEY || !STEAM_ID) {
    return NextResponse.json({ games: [...MANUAL_GAMES].sort((a, b) => b.hours - a.hours) });
  }

  const steamGames = await getSteamHours() ?? [];
  const games = [...steamGames, ...MANUAL_GAMES];
  games.sort((a, b) => b.hours - a.hours);

  return NextResponse.json({ games });
}
