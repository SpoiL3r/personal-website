import { NextResponse } from "next/server";

async function getLichess() {
  const res = await fetch("https://lichess.org/api/user/spoilerfps", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const d = await res.json();
  return {
    bullet: d.perfs?.bullet?.rating ?? null,
    blitz:  d.perfs?.blitz?.rating  ?? null,
    rapid:  d.perfs?.rapid?.rating  ?? null,
    games:  d.count?.all            ?? null,
    url: "https://lichess.org/@/spoilerfps",
  };
}

async function getChessCom() {
  const res = await fetch("https://api.chess.com/pub/player/spoilerfps/stats", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const d = await res.json();

  // chess.com stats don't return a total games count directly, but each
  // time-control block has a win/loss/draw record — sum across all of them.
  type Rec = { win?: number; loss?: number; draw?: number } | undefined;
  const sumRec = (r: Rec) => (r?.win ?? 0) + (r?.loss ?? 0) + (r?.draw ?? 0);
  const games =
    sumRec(d.chess_bullet?.record) +
    sumRec(d.chess_blitz?.record) +
    sumRec(d.chess_rapid?.record) +
    sumRec(d.chess_daily?.record);

  return {
    bullet: d.chess_bullet?.last?.rating ?? null,
    blitz:  d.chess_blitz?.last?.rating  ?? null,
    rapid:  d.chess_rapid?.last?.rating  ?? null,
    games:  games || null,
    url: "https://www.chess.com/member/spoilerfps",
  };
}

async function getLichessOpenings() {
  try {
    const res = await fetch(
      "https://lichess.org/api/games/user/spoilerfps?max=300&opening=true&rated=true",
      { headers: { Accept: "application/x-ndjson" }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const text = await res.text();
    if (!text.trim()) return null;

    const games = text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (!games.length) return null;

    // Format the first `ply` half-moves into readable chess notation.
    // e.g. moves="d4 d5 Bf4 Nf6", ply=3 → "1.d4 d5 2.Bf4"
    function formatOpeningMoves(movesStr: string, ply: number): string {
      const halfMoves = movesStr.split(" ").slice(0, Math.min(ply, 6));
      const parts: string[] = [];
      for (let i = 0; i < halfMoves.length; i++) {
        if (i % 2 === 0) parts.push(`${Math.floor(i / 2) + 1}.${halfMoves[i]}`);
        else parts.push(halfMoves[i]);
      }
      return parts.join(" ");
    }

    // Tally openings by color from the player's perspective.
    // Store moves from the first encountered game for each ECO — they are
    // deterministic for a given opening code.
    const counts: {
      white: Record<string, { name: string; eco: string; moves: string; count: number }>;
      black: Record<string, { name: string; eco: string; moves: string; count: number }>;
    } = { white: {}, black: {} };

    for (const game of games) {
      const opening = game?.opening;
      if (!opening?.eco || !opening?.name) continue;

      const isWhite =
        game?.players?.white?.user?.name?.toLowerCase() === "spoilerfps";
      const color = isWhite ? "white" : "black";
      const key = opening.eco;

      if (!counts[color][key]) {
        const moves = typeof game.moves === "string" && opening.ply > 0
          ? formatOpeningMoves(game.moves, opening.ply)
          : "";
        counts[color][key] = { name: opening.name, eco: opening.eco, moves, count: 0 };
      }
      counts[color][key].count += 1;
    }

    const toTop3 = (
      bucket: Record<string, { name: string; eco: string; moves: string; count: number }>
    ) =>
      Object.values(bucket)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(({ name, eco, moves, count }) => ({ name, eco, moves, games: count }));

    return { white: toTop3(counts.white), black: toTop3(counts.black) };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [lichess, chesscom, favouriteOpenings] = await Promise.all([
      getLichess(),
      getChessCom(),
      getLichessOpenings(),
    ]);
    return NextResponse.json({ lichess, chesscom, favouriteOpenings });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch chess stats" },
      { status: 500 }
    );
  }
}
