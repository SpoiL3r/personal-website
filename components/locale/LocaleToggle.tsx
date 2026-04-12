"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, type Locale } from "@/lib/contexts/LocaleContext";

function FlagGB() {
  return (
    <svg width="18" height="12" viewBox="0 0 60 40" aria-hidden>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagIN() {
  return (
    <svg width="18" height="12" viewBox="0 0 60 40" aria-hidden>
      <rect width="60" height="13.33" y="0" fill="#FF9933" />
      <rect width="60" height="13.34" y="13.33" fill="#FFFFFF" />
      <rect width="60" height="13.33" y="26.67" fill="#138808" />
      <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="0.6" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg width="18" height="12" viewBox="0 0 60 40" aria-hidden>
      <rect width="60" height="13.33" y="0" fill="#000000" />
      <rect width="60" height="13.34" y="13.33" fill="#DD0000" />
      <rect width="60" height="13.33" y="26.67" fill="#FFCE00" />
    </svg>
  );
}

export default function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const options: { code: Locale; label: string; Flag: React.FC; title: string }[] = [
    { code: "en", label: t.locale.englishLabel, Flag: FlagGB, title: t.locale.englishLabel },
    { code: "hi", label: t.locale.hindiLabel, Flag: FlagIN, title: t.locale.hindiLabel },
    { code: "de", label: t.locale.germanLabel, Flag: FlagDE, title: t.locale.germanLabel },
  ];

  useEffect(() => {
    if (!open) return;

    function onDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((option) => option.code === locale) ?? options[0];
  const CurrentFlag = current.Flag;

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.locale.selectLanguage}
        title={t.locale.language}
        className="locale-trigger"
      >
        <span style={{ display: "inline-flex", borderRadius: "2px", overflow: "hidden", lineHeight: 0 }}>
          <CurrentFlag />
        </span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown
          size={12}
          style={{
            transition: "transform 0.18s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.locale.options}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "160px",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.28)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            animation: "dropdown-pop 0.18s ease-out",
          }}
        >
          {options.map(({ code, label, Flag }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`locale-option${active ? " is-active" : ""}`}
              >
                <span style={{ display: "inline-flex", borderRadius: "2px", overflow: "hidden", lineHeight: 0, flexShrink: 0 }}>
                  <Flag />
                </span>
                <span style={{ flex: 1 }}>{label}</span>
                {active && (
                  <span style={{ fontSize: "0.68rem", color: "var(--accent)" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
