"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, type Locale } from "@/lib/contexts/LocaleContext";

export default function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: t.locale.englishLabel },
    { code: "hi", label: t.locale.hindiLabel },
    { code: "de", label: t.locale.germanLabel },
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

  return (
    <div ref={rootRef} className="locale-root">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.locale.selectLanguage}
        title={t.locale.language}
        className="locale-trigger meta"
      >
        {locale.toUpperCase()}
        <ChevronDown size={12} strokeWidth={1.5} aria-hidden />
      </button>

      {open && (
        <div role="listbox" aria-label={t.locale.options} className="locale-panel">
          {options.map(({ code, label }) => {
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
                <span className="bullet" aria-hidden>
                  {active ? "·" : ""}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
