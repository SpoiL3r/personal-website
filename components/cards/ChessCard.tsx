/**
 * ChessCard displays live chess ratings from Lichess and Chess.com side-by-side.
 */
"use client";

import { ArrowUpRight, Crown, Shield, Sword } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useChessStats } from "@/lib/hooks/useChessStats";

function ChessMoves({ moves }: { moves: string }) {
  const tokens = moves.split(" ");
  return (
    <span style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.01em", fontSize: "0.67rem" }}>
      {tokens.map((token, i) => {
        const dotIdx = token.indexOf(".");
        if (dotIdx > 0 && /^\d/.test(token)) {
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

        return (
          <span key={i} style={{ color: "var(--text-muted)", marginRight: "0.15rem" }}>
            {" "}
            {token}
          </span>
        );
      })}
    </span>
  );
}

function ratingColor(rating: number, isDark: boolean) {
  if (isDark) {
    if (rating >= 1500) return "#f2f3f5";
    if (rating >= 1200) return "#c3c8cf";
    if (rating >= 900) return "#9aa1aa";
    return "#8b949e";
  }
  if (rating >= 1500) return "#0550ae";
  if (rating >= 1200) return "#0969da";
  if (rating >= 900) return "#218bff";
  return "#59636e";
}

export default function ChessCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { stats, loading } = useChessStats();

  const controls = [
    { key: "bullet" as const, label: t.extracurricular.bullet, icon: <Sword size={13} /> },
    { key: "blitz" as const, label: t.extracurricular.blitz, icon: <Shield size={13} /> },
    { key: "rapid" as const, label: t.extracurricular.rapid, icon: <Crown size={13} /> },
  ];

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
              background: "var(--bg-terminal)",
              color: "var(--text)",
              fontSize: "0.55rem",
              fontWeight: 700,
            }}
          >
            L
          </span>
          LICHESS <ArrowUpRight size={9} />
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
              background: "var(--bg-hover)",
              color: "var(--text)",
              fontSize: "0.55rem",
              fontWeight: 700,
            }}
          >
            C
          </span>
          CHESS.COM <ArrowUpRight size={9} />
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
                      color: ratingColor(rating, isDark),
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
            backgroundColor: "var(--accent)",
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
            const ops = stats.favouriteOpenings?.[color];
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
                      background: color === "white" ? "var(--text)" : "var(--bg-terminal)",
                      color: color === "white" ? "var(--bg)" : "var(--text)",
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
                    const displayName = op.name.includes(": ") ? op.name.split(": ").slice(1).join(": ") : op.name;
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
                          <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text)" }}>{displayName}</span>
                          {op.moves && (
                            <span style={{ color: "var(--text-dim)" }}>
                              {": "}
                              <ChessMoves moves={op.moves} />
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontFamily: "var(--font-mono, monospace)",
                            color: "var(--text-dim)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
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
