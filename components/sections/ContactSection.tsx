"use client";

import React from "react";
import Section from "./Section";
import { useLocale } from "@/lib/contexts/LocaleContext";

const EMAIL = "think.vaibhavsingh@gmail.com";

export default function ContactSection() {
  const { t } = useLocale();

  return (
    <Section
      id="contact"
      label={t.nav.contact}
      title={t.sections.contactTitle}
      subtitle={t.sections.contactSubtitle}
    >
      <div className="contact">
        <div className="contact-main">
          <p className="lead" style={{ maxWidth: "44ch" }}>
            {t.contact.intro}
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="btn btn-primary"
            style={{ marginTop: "var(--s-32)" }}
          >
            {t.contact.emailMe}
          </a>
        </div>

        <dl className="contact-aside">
          <div>
            <dt className="meta">Email</dt>
            <dd>
              <a href={`mailto:${EMAIL}`} className="small link">
                {EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="meta">{t.contact.locationLabel}</dt>
            <dd className="small">{t.contact.locationLine}</dd>
          </div>
          <div>
            <dt className="meta">{t.social.github}</dt>
            <dd>
              <a
                href="https://github.com/SpoiL3r"
                target="_blank"
                rel="noopener noreferrer"
                className="small link"
              >
                github.com/SpoiL3r
              </a>
            </dd>
          </div>
          <div>
            <dt className="meta">{t.social.linkedin}</dt>
            <dd>
              <a
                href="https://linkedin.com/in/vaibhavcs"
                target="_blank"
                rel="noopener noreferrer"
                className="small link"
              >
                linkedin.com/in/vaibhavcs
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
