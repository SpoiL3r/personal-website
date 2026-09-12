"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function HomeHero() {
  const { t } = useLocale();
  const reduced = useReducedMotion();

  /** Three mount steps only: eyebrow, name, everything else. */
  const step = (index: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.32, delay: index * 0.06, ease: EASE },
        };

  return (
    <section id="home" className="site-wrap hero">
      <motion.p className="meta hero-eyebrow" {...step(0)}>
        {t.hero.subtitle}
      </motion.p>

      <div className="hero-body">
        <motion.h1 className="display" {...step(1)}>
          {t.about.fullName}
        </motion.h1>

        <motion.div {...step(2)}>
          <p className="lead">{t.hero.roleLine}</p>

          <div className="hero-actions">
            <Link href="/#experience" className="btn btn-primary">
              {t.nav.experience}
            </Link>
            <Link href="/#contact" className="btn btn-outline">
              {t.contact.emailMe}
            </Link>
          </div>

          <p className="meta hero-status">
            <span className="dot" aria-hidden />
            {t.hero.availableBadge}
            <span aria-hidden>{"·"}</span>
            {t.about.location}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
