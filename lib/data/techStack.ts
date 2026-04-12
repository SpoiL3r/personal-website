/**
 * Tech-stack categories displayed in the SystemKnowledge section.
 * Each category has a label key (matched against the i18n locale), a lucide
 * icon for the header, an accent colour, and a list of technology labels.
 */

import {
  Code2, Network, Database, Server, BarChart2, Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

export interface TechItem {
  label: string;
}

export interface Category {
  labelKey: "coreLanguages" | "distributedSystems" | "data" | "infrastructure" | "observability" | "buildDev";
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accent: string;
  items: TechItem[];
}

export const CATEGORIES: Category[] = [
  {
    labelKey: "coreLanguages",
    icon: Code2,
    accent: "#00c9b1",
    items: [
      { label: "Java 21" },
      { label: "JavaScript" },
      { label: "XML" },
      { label: "SQL" },
    ],
  },
  {
    labelKey: "buildDev",
    icon: Wrench,
    accent: "#22c55e",
    items: [
      { label: "Spring Boot" },
      { label: "SAP UI5" },
      { label: "Maven" },
      { label: "Git" },
      { label: "CI/CD Pipelines" },
      { label: "SonarQube" },
    ],
  },
  {
    labelKey: "data",
    icon: Database,
    accent: "#3b82f6",
    items: [
      { label: "SAP HANA" },
      { label: "MySQL" },
    ],
  },
  {
    labelKey: "distributedSystems",
    icon: Network,
    accent: "#8b5cf6",
    items: [
      { label: "Cloud Foundry" },
      { label: "Apache Kafka" },
      { label: "Redis" },
    ],
  },
  {
    labelKey: "infrastructure",
    icon: Server,
    accent: "#f59e0b",
    items: [
      { label: "SAP BTP" },
      { label: "Docker" },
      { label: "Linux / Nginx" },
    ],
  },
  {
    labelKey: "observability",
    icon: BarChart2,
    accent: "#ec4899",
    items: [
      { label: "Grafana" },
      { label: "Kibana" },
      { label: "Dynatrace" },
    ],
  },
];
