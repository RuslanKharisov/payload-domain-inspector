#!/usr/bin/env node
import { runInspector } from "../src/index.js";

async function main() {
  const cwd = process.cwd();
  const [, , maybeInput] = process.argv;

  await runInspector(cwd, maybeInput);
}

main().catch((err) => {
  console.error("[payload-domain-inspector] Error:", err);
  process.exit(1);
});
