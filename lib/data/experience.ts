/**
 * @file experience.ts
 * @description Static data for the professional experience and education sections.
 *
 * Exports:
 *  - `TimelineEntry` - shape of a single timeline entry
 *  - `EXPERIENCE`    - ordered list of professional roles (newest first)
 *  - `EDUCATION`     - ordered list of academic qualifications (newest first)
 */

/**
 * A single entry on the experience or education timeline.
 *
 * `roles` is used where one organisation covered more than one title, so the
 * progression renders as its own stacked list instead of being crammed into
 * a single `role` string.
 */
export interface TimelineEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  /** Title progression within the same organisation, newest first. */
  roles?: { title: string; period: string }[];
  tags?: string[];
  /** Square logo URL - rendered in place of the timeline dot */
  logo?: string;
}

/** Professional work history, listed in reverse-chronological order. */
export const EXPERIENCE: TimelineEntry[] = [
  {
    company: "SAP Labs India",
    role: "Software Developer",
    period: "Oct 2024 → Present",
    location: "Bengaluru, India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    tags: ["Java", "Spring Boot", "SAP CAP", "OData", "HANA", "Cloud Foundry"],
  },
  {
    company: "SAP SE",
    role: "Software Developer",
    period: "Apr 2021 → Oct 2024",
    location: "St. Leon-Rot, Germany",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    roles: [
      { title: "Software Developer", period: "Mar 2023 → Oct 2024" },
      { title: "Associate Software Developer", period: "Apr 2021 → Mar 2023" },
    ],
    tags: ["Java", "Spring Boot", "REST", "HANA", "MySQL", "UI5"],
  },
  {
    company: "Daimler AG",
    role: "Student Intern",
    period: "Jan 2020 → Jul 2020",
    location: "Stuttgart, Germany",
    logo: "https://www.google.com/s2/favicons?domain=mercedes-benz.com&sz=128",
    tags: ["Integration", "Legacy Systems"],
  },
  {
    company: "GlobalLogic",
    role: "Associate Analyst",
    period: "Aug 2016 → Sep 2017",
    location: "Gurgaon, India",
    logo: "https://www.google.com/s2/favicons?domain=globallogic.com&sz=128",
    tags: ["Data Validation", "ML Ops"],
  },
];

/** Academic qualifications, listed in reverse-chronological order. */
export const EDUCATION: TimelineEntry[] = [
  {
    company: "SRH Hochschule Heidelberg",
    role: "M.Sc. Applied Computer Science",
    period: "Oct 2018 → Dec 2020",
    location: "Heidelberg, Germany",
    logo: "https://www.google.com/s2/favicons?domain=hochschule-heidelberg.de&sz=128",
    tags: [
      "Distributed Systems",
      "Software Development Practice",
      "Advanced Databases",
      "Software Architecture and Development",
      "IT-Security",
    ],
  },
  {
    company: "Dr. APJ Abdul Kalam Technical University",
    role: "B.Tech, Computer Science and Engineering",
    period: "Jun 2012 → Jun 2016",
    location: "Greater Noida, India",
    logo: "/logos/aktu.png",
    tags: [
      "Data Structures",
      "Operating System",
      "Database Management System",
      "Design and Analysis of Algorithms",
      "Computer Networks",
    ],
  },
];
