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
        padding: "4rem 0 1rem",
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
              maxWidth: "560px",
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              margin: "0 0 2rem",
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
