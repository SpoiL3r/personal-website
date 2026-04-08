"use client";

import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

const skills = [
  "Java 21", "Spring Boot", "Microservices", "SAP CAP",
  "Node.js", "REST APIs", "OData", "Apache Kafka",
  "Docker", "Cloud Foundry", "SAP HANA", "MySQL",
  "Redis", "JUnit", "Mockito", "CI/CD",
];

export default function SkillsGrid() {
  return (
    <StaggerContainer
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      {skills.map((skill) => (
        <StaggerItem key={skill}>
          <span className="tag tag-hover">{skill}</span>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
