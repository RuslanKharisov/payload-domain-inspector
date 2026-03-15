import fs from "node:fs";
import path from "node:path";

export type InspectorConfig = {
  input: string;
  outputDir: string;
  includeEntities?: string[];
  ignoreFields?: string[];
  formats?: ("ts" | "mermaid" | "md")[];
};

const DEFAULT_CONFIG: InspectorConfig = {
  input: "./payload-types.ts",
  outputDir: "./domain",
  formats: ["ts", "mermaid", "md"],
  ignoreFields: ["createdAt", "updatedAt", "version"],
};

export function loadConfig(cwd: string): InspectorConfig {
  const configPath = path.join(cwd, "payload-domain.config.json");

  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<InspectorConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  }

  return DEFAULT_CONFIG;
}
