"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Section wrapper for the one-page layout.
 *
 * The <section> element IS the 12-column grid: a wrapper div inside it would
 * become the only grid item and every `grid-column` placement below would stop
 * resolving, collapsing the page to a single column.
 */
export default function Section({ id, label, title, subtitle, children }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      className="site-wrap section-grid"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <p className="meta section-label">{label}</p>
      <div className="section-body">
        <h2>{title}</h2>
        {subtitle && <p className="lead">{subtitle}</p>}
        {children}
      </div>
    </motion.section>
  );
}
