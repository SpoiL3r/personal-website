"use client";

import Section from "@/components/sections/Section";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { CATEGORIES } from "@/lib/data/techStack";

export default function SystemKnowledge() {
  const { t } = useLocale();

  return (
    <Section id="stack" rank="minor" title={t.nav.stack}>
      <dl className="sk">
        {CATEGORIES.map(({ labelKey, icon: CatIcon, items }) => (
          <div key={labelKey} className="sk-row">
            <dt className="sk-term">
              <CatIcon size={16} strokeWidth={1.5} />
              <h3>{t.systemKnowledge[labelKey]}</h3>
            </dt>
            <dd>
              <ul className="tech">
                {items.map(({ label }) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
