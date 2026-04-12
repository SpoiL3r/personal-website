import assert from "node:assert/strict";
import test from "node:test";
import { NAV_ITEMS, hrefForNavItem, isNavItemActive, shouldSmoothScroll } from "./navModel.mjs";

function navItem(key) {
  const item = NAV_ITEMS.find((entry) => entry.key === key);
  assert.ok(item, `expected nav item "${key}" to exist`);
  return item;
}

test("about and experience remain homepage anchors", () => {
  const about = navItem("about");
  const experience = navItem("experience");

  assert.equal(hrefForNavItem(about, "/"), "/#about");
  assert.equal(hrefForNavItem(experience, "/"), "/#experience");
  assert.equal(hrefForNavItem(about, "/missing"), "/#about");
  assert.equal(isNavItemActive(about, "/", "about"), true);
  assert.equal(isNavItemActive(experience, "/", "experience"), true);
  assert.equal(isNavItemActive(about, "/missing", "about"), false);
});

test("homepage-only sections remain anchored to the home route", () => {
  const education = navItem("education");

  assert.equal(hrefForNavItem(education, "/"), "/#education");
  assert.equal(hrefForNavItem(education, "/missing"), "/#education");
  assert.equal(shouldSmoothScroll(education, "/"), true);
  assert.equal(shouldSmoothScroll(education, "/missing"), false);
  assert.equal(isNavItemActive(education, "/", "education"), true);
});
