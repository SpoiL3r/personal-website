/**
 * @typedef {"home" | "about" | "experience" | "education" | "offClock" | "contact"} NavLabelKey
 * @typedef {"home" | "section"} NavKind
 *
 * @typedef {Object} NavItem
 * @property {string} key
 * @property {NavLabelKey} labelKey
 * @property {NavKind} kind
 * @property {string} route
 * @property {string | undefined} target
 */

/** @type {readonly NavItem[]} */
export const NAV_ITEMS = Object.freeze([
  { key: "home", labelKey: "home", kind: "home", route: "/", target: "home" },
  { key: "about", labelKey: "about", kind: "section", route: "/#about", target: "about" },
  { key: "experience", labelKey: "experience", kind: "section", route: "/#experience", target: "experience" },
  { key: "education", labelKey: "education", kind: "section", route: "/#education", target: "education" },
  { key: "extracurricular", labelKey: "offClock", kind: "section", route: "/#extracurricular", target: "extracurricular" },
  { key: "contact", labelKey: "contact", kind: "section", route: "/#contact", target: "contact" },
]);

/**
 * @param {NavItem} item
 * @param {string | null} pathname
 */
export function hrefForNavItem(item, pathname) {
  if (pathname === "/" && item.target) {
    return item.target === "home" ? "/" : `/#${item.target}`;
  }

  return item.route;
}

/**
 * @param {NavItem} item
 * @param {string | null} pathname
 * @param {string} activeSection
 */
export function isNavItemActive(item, pathname, activeSection) {
  return pathname === "/" && item.target ? activeSection === item.target : false;
}

/**
 * @param {NavItem} item
 * @param {string | null} pathname
 */
export function shouldSmoothScroll(item, pathname) {
  return pathname === "/" && Boolean(item.target);
}
