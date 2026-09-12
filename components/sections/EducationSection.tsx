"use client";

import React from "react";
import Image from "next/image";
import Section from "./Section";
import { EDUCATION } from "@/lib/data/experience";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function EducationSection() {
  const { t } = useLocale();

  return (
    <Section
      id="education"
      label={t.nav.education}
      title={t.sections.educationTitle}
      subtitle={t.sections.educationSubtitle}
    >
      <ul className="rows">
        {EDUCATION.map((edu) => (
          <li key={edu.company} className="row row-edu">
            <div className="row-mark">
              <span className={edu.logo ? "tile" : "tile tile-mono"}>
                {edu.logo ? (
                  <Image
                    src={edu.logo}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized={edu.logo.endsWith(".svg")}
                  />
                ) : (
                  edu.company.charAt(0)
                )}
              </span>
            </div>

            <div className="row-main">
              <h3>{edu.company}</h3>
              <p className="small">{edu.role}</p>
              {edu.tags && edu.tags.length > 0 && (
                <ul className="tech">
                  {edu.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="row-aside">
              <p className="meta-date">{edu.period}</p>
              <p className="meta-date">{edu.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
