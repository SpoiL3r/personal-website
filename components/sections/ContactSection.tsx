"use client";

import React from "react";
import Section from "./Section";
import { useLocale } from "@/lib/contexts/LocaleContext";

const EMAIL = "think.vaibhavsingh@gmail.com";

export default function ContactSection() {
  const { t } = useLocale();

  return (
    <Section id="contact" rank="close" title={t.nav.contact}>
      <div className="contact">
        <div className="contact-main">
          <p className="lead">{t.contact.intro}</p>
          <a href={`mailto:${EMAIL}`} className="btn btn-primary">
            {t.contact.emailMe}
          </a>
        </div>

        <dl className="contact-aside">
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
