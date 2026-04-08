/**
 * Tech-stack categories displayed in the SystemKnowledge section.
 * Each category has a label key (matched against the i18n locale), a lucide
 * icon, an accent colour, and a list of technology items with their icons.
 */

import React from "react";
import {
  Code2, Network, Database, Server, BarChart2, Wrench,
} from "lucide-react";
import {
  SiOpenjdk, SiJavascript, SiMysql, SiApachekafka,
  SiRedis, SiDocker, SiLinux,
  SiGrafana, SiKibana, SiSap, SiSpring, SiGit,
  SiSonarqubecloud, SiJenkins,
} from "react-icons/si";

export interface TechItem {
  icon: React.ReactNode;
  label: string;
}

export interface Category {
  labelKey: "coreLanguages" | "distributedSystems" | "data" | "infrastructure" | "observability" | "buildDev";
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accent: string;
  items: TechItem[];
}

const si = (Icon: React.ComponentType<{ style?: React.CSSProperties; size?: number }>, color: string) => (
  React.createElement(Icon, { style: { color }, size: 14 })
);

// Ordered so related categories sit next to each other:
// languages → frameworks/build, data → distributed, infra → observability.
export const CATEGORIES: Category[] = [
  {
    labelKey: "coreLanguages",
    icon: Code2,
    accent: "#00c9b1",
    items: [
      { icon: si(SiOpenjdk, "#f89820"), label: "Java 21" },
      { icon: si(SiJavascript, "#f7df1e"), label: "JavaScript" },
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "📄"), label: "XML" },
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "📜"), label: "SQL" },
    ],
  },
  {
    labelKey: "buildDev",
    icon: Wrench,
    accent: "#22c55e",
    items: [
      { icon: si(SiSpring, "#6db33f"), label: "Spring Boot" },
      { icon: si(SiSap, "#0070f2"), label: "SAP UI5" },
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "📦"), label: "Maven" },
      { icon: si(SiGit, "#f05032"), label: "Git" },
      { icon: si(SiJenkins, "#d24939"), label: "CI/CD Pipelines" },
      { icon: si(SiSonarqubecloud, "#4e9bcd"), label: "SonarQube" },
    ],
  },
  {
    labelKey: "data",
    icon: Database,
    accent: "#3b82f6",
    items: [
      { icon: si(SiSap, "#1872a4"), label: "SAP HANA" },
      { icon: si(SiMysql, "#4479a1"), label: "MySQL" },
    ],
  },
  {
    labelKey: "distributedSystems",
    icon: Network,
    accent: "#8b5cf6",
    items: [
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "☁️"), label: "Cloud Foundry" },
      { icon: si(SiApachekafka, "#aaaaaa"), label: "Apache Kafka" },
      { icon: si(SiRedis, "#ff4438"), label: "Redis" },
    ],
  },
  {
    labelKey: "infrastructure",
    icon: Server,
    accent: "#f59e0b",
    items: [
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "☁️"), label: "SAP BTP" },
      { icon: si(SiDocker, "#2496ed"), label: "Docker" },
      { icon: si(SiLinux, "#fcc624"), label: "Linux / Nginx" },
    ],
  },
  {
    labelKey: "observability",
    icon: BarChart2,
    accent: "#ec4899",
    items: [
      { icon: si(SiGrafana, "#f46800"), label: "Grafana" },
      { icon: si(SiKibana, "#f04e98"), label: "Kibana" },
      { icon: React.createElement("span", { style: { fontSize: "0.8rem" } }, "📡"), label: "Dynatrace" },
    ],
  },
];
