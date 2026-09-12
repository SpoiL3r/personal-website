"use client";

import Image from "next/image";
import type { TimelineEntry } from "@/lib/data/experience";

interface ExperienceTimelineProps {
  jobs: TimelineEntry[];
}

export default function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  return (
    <ul className="rows">
      {jobs.map((exp) => (
        <li key={exp.company} className="row row-exp">
          <div className="row-mark">
            <span className={exp.logo ? "tile" : "tile tile-mono"}>
              {exp.logo ? (
                <Image
                  src={exp.logo}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized={exp.logo.endsWith(".svg")}
                />
              ) : (
                exp.company.charAt(0)
              )}
            </span>
          </div>

          <div className="row-main">
            <h3>{exp.company}</h3>
            {exp.roles ? (
              <ul className="roles small">
                {exp.roles.map((step) => (
                  <li key={step.title}>
                    <span>{step.title}</span>
                    <span className="meta-date">{step.period}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small">{exp.role}</p>
            )}
            {exp.tags && exp.tags.length > 0 && (
              <ul className="tech">
                {exp.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="row-aside">
            {/* With a role progression the per-title periods already carry the
                dates, so the aggregate span would just repeat them. */}
            {!exp.roles && <p className="meta-date">{exp.period}</p>}
            <p className="meta-date">{exp.location}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
