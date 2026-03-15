import path from "node:path";
import { loadConfig } from "./config.js";
import { parsePayloadTypes } from "../parser/parsePayloadTypes.js";
import { generateDomainSchemaTs } from "../generators/generateDomainSchemaTs.js";
import { generateMermaidEr } from "../generators/generateMermaidEr.js";
import { generateMarkdownSummary } from "../generators/generateMarkdownSummary.js";

export async function runInspector(cwd: string, inputArg?: string) {
  const config = loadConfig(cwd);

  const inputPath = inputArg
    ? path.resolve(cwd, inputArg)
    : path.resolve(cwd, config.input);

  const entities = await parsePayloadTypes(inputPath);

  const outputDir = path.resolve(cwd, config.outputDir);

  const formats = config.formats ?? ["ts", "mermaid", "md"];

  if (formats.includes("ts")) {
    generateDomainSchemaTs(entities, outputDir);
  }
  if (formats.includes("mermaid")) {
    generateMermaidEr(entities, outputDir);
  }
  if (formats.includes("md")) {
    generateMarkdownSummary(entities, outputDir);
  }
}
