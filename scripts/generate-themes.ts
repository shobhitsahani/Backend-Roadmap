import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generatedFiles } from "../lib/theme/generate";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const stale: string[] = [];

for (const file of generatedFiles) {
  const absolute = join(root, file.path);
  const expected = file.render().replace(/\r\n/g, "\n");
  const actual = existsSync(absolute)
    ? readFileSync(absolute, "utf8").replace(/\r\n/g, "\n")
    : null;

  if (check) {
    if (actual !== expected) stale.push(file.path);
    continue;
  }

  if (actual !== expected) {
    writeFileSync(absolute, expected, "utf8");
    console.log(`updated ${file.path}`);
  }
}

if (check && stale.length > 0) {
  console.error(
    `Generated theme files are stale:\n${stale.map((file) => `  - ${file}`).join("\n")}\nRun: npm run tokens`,
  );
  process.exit(1);
}

if (check) console.log("theme files are up to date");
