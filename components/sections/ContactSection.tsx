"use client";

import React from "react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Section from "./Section";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function ContactSection() {
  const { t } = useLocale();

  return (
    <Section
      id="contact"
      title={t.sections.contactTitle}
      subtitle={t.sections.contactSubtitle}
    >
      <div className="contact-card">
        <p style={{ margin: 0, maxWidth: "52ch", lineHeight: 1.75, fontSize: "1.02rem" }}>
          {t.contact.intro}
        </p>

        <div className="contact-actions">
          <a href="mailto:think.vaibhavsingh@gmail.com" className="btn btn-primary">
            <Mail size={16} />
            {t.contact.emailMe}
          </a>
          <a href="/vaibhav_singh_cv.pdf" download="Vaibhav_Singh_Resume.pdf" className="btn btn-outline">
            <Download size={16} />
            {t.contact.downloadResume}
          </a>
        </div>

        <div className="contact-footer">
          <span className="contact-detail">think.vaibhavsingh@gmail.com</span>
          <span className="contact-sep" aria-hidden />
          <span className="contact-detail">{t.contact.locationLine}</span>
          <span className="contact-sep" aria-hidden />
          <a href="https://github.com/SpoiL3r" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaGithub size={13} /> {t.social.github} <ArrowUpRight size={10} />
          </a>
          <a href="https://linkedin.com/in/vaibhavcs" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaLinkedin size={13} /> {t.social.linkedin} <ArrowUpRight size={10} />
          </a>
        </div>
      </div>
    </Section>
  );
}
