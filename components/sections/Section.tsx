"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Section wrapper for the one-page layout.
 *
 * - Anchor target (`id`) for the navbar scroll-spy
 * - Reveals on scroll into view
 * - Clean title + optional subtitle (no kill-feed labels)
 */
export default function Section({ id, title, subtitle, children }: Props) {
  const reduced = useReducedMotion();
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: "80px",
        padding: "3.5rem 0 1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            margin: "0 0 0.5rem",
            color: "var(--text)",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-dim)",
              margin: "0 0 1.75rem",
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </motion.div>
    </section>
  );
}
