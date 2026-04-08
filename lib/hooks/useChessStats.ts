"use client";

import { useEffect, useState } from "react";

/** Stats for a single chess platform. Null fields mean the API did not return data. */
export interface Platform {
  /** Bullet time-control rating (< 3 min games). */
  bullet: number | null;
  /** Blitz time-control rating (3–10 min games). */
  blitz: number | null;
  /** Rapid time-control rating (> 10 min games). */
  rapid: number | null;
  /** Total games played on this platform. */
  games: number | null;
  /** Profile URL used for the column header link. */
  url: string;
}

/** A single opening entry returned by the API. */
export interface FavouriteOpening {
  /** Human-readable opening name (e.g. "Sicilian Defense"). */
  name: string;
  /** ECO code for the opening (e.g. "B90"). */
  eco: string;
  /** First 2–3 moves in standard chess notation, e.g. "1.d4 d5 2.Bf4". */
  moves: string;
  /** Number of games played with this opening. */
  games: number;
}

/** Top-level shape returned by /api/chess-stats. */
export interface ChessStats {
  /** Null when the Lichess API request failed or returned no usable data. */
  lichess: Platform | null;
  /** Null when the Chess.com API request failed or returned no usable data. */
  chesscom: Platform | null;
  /** Optional; only present when the backend successfully parses opening history. */
  favouriteOpenings?: { white: FavouriteOpening[]; black: FavouriteOpening[] } | null;
}

/** Fetches /api/chess-stats on mount, with abort-on-unmount cleanup. */
export function useChessStats(): {
  stats: ChessStats | null;
  loading: boolean;
  error: boolean;
} {
  const [stats, setStats] = useState<ChessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/chess-stats", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: ChessStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        // Ignore abort errors — the component was simply unmounted.
        if (err?.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { stats, loading, error };
}
