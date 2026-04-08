/**
 * ChessCard — displays live chess ratings from Lichess and Chess.com side-by-side.
 *
 * Data flow:
 *   1. On mount, fetches /api/chess-stats (server route that calls both platform APIs).
 *   2. While loading, three skeleton bars are shown (pulse-skeleton animation).
 *   3. If both platforms fail to return data, a localised error message is shown.
 *   4. If at least one platform responds, ratings for bullet / blitz / rapid are
 *      rendered in a 3-column grid (label | Lichess | Chess.com).
 *   5. Missing ratings from a platform render as a dash "-" rather than crashing.
 *   6. If the API returns favouriteOpenings, a bonus section lists openings by colour.
 *
 * The onLoaded callback is forwarded to the parent (e.g. OffClock section) so it
 * can coordinate staggered reveal animations after async data arrives.
 */
"use client";

import { useEffect } from "react";
import { Crown, Shield, Sword } from "lucide-react";
import { HiArrowUpRight } from "react-icons/hi2";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useChessStats } from "@/lib/hooks/useChessStats";

/**
 * Renders chess moves in Lichess style:
 * move numbers are dim/small, white moves are bold, black moves are muted.
 * Input: "1.d4 d5 2.Bf4 Nf6" — already formatted by the API.
 */
function ChessMoves({ moves }: { moves: string }) {
  const tokens = moves.split(" ");
  return (
    <span style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.01em", fontSize: "0.67rem" }}>
      {tokens.map((token, i) => {
        const dotIdx = token.indexOf(".");
        if (dotIdx > 0 && /^\d/.test(token)) {
          // "1.d4" → dim number + bold white move
          const num = token.slice(0, dotIdx + 1);
          const move = token.slice(dotIdx + 1);
          return (
            <span key={i} style={{ marginRight: "0.15rem" }}>
              {i > 0 && " "}
              <span style={{ color: "var(--text-dim)", fontSize: "0.56rem" }}>{num}</span>
              <span style={{ color: "var(--text)", fontWeight: 700 }}>{move}</span>
            </span>
          );
        }
        // Black move — muted, space before
        return (
          <span key={i} style={{ color: "var(--text-muted)", marginRight: "0.15rem" }}>
            {" "}{token}
          </span>
        );
      })}
    </span>
  );
}

/** Props for the ChessCard component. */
interface Props {
  /** Called once after stats have been fetched and state has been set. */
  onLoaded?: () => void;
}

/**
 * Maps a numeric chess rating to a display colour.
 * Thresholds are loosely based on Lichess rating bands:
 *   ≥ 1500 → green  (strong club player)
 *   ≥ 1200 → orange (intermediate)
 *   ≥ 900  → blue   (beginner/casual)
 *   < 900  → grey   (new / unrated)
 */
function ratingColor(rating: number) {
  if (rating >= 1500) return "#3fb950";
  if (rating >= 1200) return "#f89820";
  if (rating >= 900) return "#58a6ff";
  return "#8b949e";
}

/** Renders a side-by-side Lichess / Chess.com rating comparison card. */
export default function ChessCard({ onLoaded }: Props) {
  const { t } = useLocale();
  const { stats, loading } = useChessStats();

  // Row definitions for the rating grid — order determines visual order.
  const controls = [
    { key: "bullet" as const, label: t.extracurricular.bullet, icon: <Sword size={13} /> },
    { key: "blitz" as const, label: t.extracurricular.blitz, icon: <Shield size={13} /> },
    { key: "rapid" as const, label: t.extracurricular.rapid, icon: <Crown size={13} /> },
  ];

  // Notify parent once data has settled so it can coordinate reveal animations.
  // The hook handles fetch cancellation on unmount automatically.
  useEffect(() => {
    if (!loading) onLoaded?.();
  }, [loading, onLoaded]);


  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "2rem",
              background: "var(--bg-hover)",
              borderRadius: "6px",
              animation: "pulse-skeleton 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (!stats?.lichess && !stats?.chesscom) {
    return (
      <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
        {t.extracurricular.failedToLoad}
      </p>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1fr",
          gap: "0.25rem",
          marginBottom: "0.5rem",
          padding: "0 0.25rem",
        }}
      >
        <span />
        <a
          href={stats.lichess?.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            textDecoration: "none",
            letterSpacing: "0.06em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              borderRadius: "3px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111827",
              color: "#f8fafc",
              fontSize: "0.55rem",
              fontWeight: 700,
            }}
          >
            L
          </span>
          LICHESS <HiArrowUpRight size={9} />
        </a>
        <a
          href={stats.chesscom?.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            textDecoration: "none",
            letterSpacing: "0.06em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              borderRadius: "3px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#16a34a",
              color: "#f8fafc",
              fontSize: "0.55rem",
              fontWeight: 700,
            }}
          >
            C
          </span>
          CHESS.COM <HiArrowUpRight size={9} />
        </a>
      </div>

      {controls.map(({ key, label, icon }, idx) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 1fr",
            gap: "0.25rem",
            padding: "0.55rem 0.25rem",
            borderTop: idx === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                color: "var(--text-muted)",
              }}
            >
              {icon}
            </span>
            <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)" }}>
              {label}
            </span>
          </div>

          {[stats.lichess, stats.chesscom].map((platform, index) => {
            const rating = platform?.[key];
            return (
              <div key={index} style={{ textAlign: "center" }}>
                {rating ? (
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono, monospace)",
                      color: ratingColor(rating),
                    }}
                  >
                    {rating}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>-</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1fr",
          gap: "0.25rem",
          marginTop: "0.55rem",
          padding: "0 0.25rem",
        }}
      >
        <span />
        <div style={{ textAlign: "center" }}>
          {stats.lichess?.games ? (
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)" }}>
              {stats.lichess.games.toLocaleString()} {t.extracurricular.gamesSuffix}
            </span>
          ) : (
            <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>-</span>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          {stats.chesscom?.games ? (
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)" }}>
              {stats.chesscom.games.toLocaleString()} {t.extracurricular.gamesSuffix}
            </span>
          ) : (
            <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>-</span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.85rem",
          paddingTop: "0.7rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#3fb950",
            animation: "pulse-dot 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "0.62rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t.extracurricular.liveFromChess} · {t.extracurricular.updatedHourly}
        </span>
      </div>

      {stats.favouriteOpenings && (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.65rem 0.75rem",
            borderRadius: "8px",
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            {t.extracurricular.favouriteOpenings}
          </div>
          {(["white", "black"] as const).map((color, index) => {
            const ops = stats.favouriteOpenings![color];
            if (!ops?.length) return null;

            return (
              <div
                key={color}
                style={{
                  paddingTop: index === 0 ? 0 : "0.6rem",
                  marginTop: index === 0 ? 0 : "0.6rem",
                  borderTop: index === 0 ? "none" : "1px dashed var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "4px",
                      background: color === "white" ? "#f0f0f0" : "#1a1a1a",
                      color: color === "white" ? "#1a1a1a" : "#f0f0f0",
                      border: "1px solid var(--border-strong)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    ♞
                  </span>
                  <span
                    style={{
                      fontSize: "0.58rem",
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--text-dim)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {color === "white" ? t.extracurricular.asWhite : t.extracurricular.asBlack}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {ops.map((op, i) => {
                    // Show just the variation when the name has a colon:
                    // "Queen's Pawn Game: London System" → "London System"
                    const displayName = op.name.includes(": ")
                      ? op.name.split(": ").slice(1).join(": ")
                      : op.name;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          paddingLeft: "1.65rem",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text)" }}>
                            {displayName}
                          </span>
                          {op.moves && (
                            <span style={{ color: "var(--text-dim)" }}>{": "}<ChessMoves moves={op.moves} /></span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)", whiteSpace: "nowrap", flexShrink: 0 }}>
                          {op.games} {t.extracurricular.gamesSuffix}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
