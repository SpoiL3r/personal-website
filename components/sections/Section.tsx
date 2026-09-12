import type { ReactNode } from "react";

type Rank = "primary" | "minor" | "close";

interface Props {
  id: string;
  /**
   * The only hierarchy control on the page. Sets the heading's column and
   * size, the body's span, the section's air, and the weight of the rule it
   * opens on. See the section rank block in globals.css.
   */
  rank: Rank;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Section wrapper for the one-page layout.
 *
 * The <section> element IS the 12-column grid: a wrapper div inside it would
 * become the only grid item and every `grid-column` placement below would stop
 * resolving, collapsing the page to a single column. The h2 and the
 * .section-body are therefore siblings, placed by rank.
 */
export default function Section({ id, rank, title, subtitle, children }: Props) {
  return (
    <section id={id} className={`site-wrap section-grid section-${rank}`}>
      <h2>{title}</h2>
      <div className="section-body">
        {subtitle && <p className="lead">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
