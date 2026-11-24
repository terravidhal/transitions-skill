// Resolve Playwright without adding it to the shipped skill.
// Install it for the demo only: npm i -D playwright && npx playwright install chromium
// Or point PLAYWRIGHT_MODULE at an existing playwright/index.mjs.

import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

async function importFrom(candidate) {
  const url = candidate.startsWith("file:") ? candidate : `file://${candidate}`;
  return import(url);
}

export async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    // fall through
  }
  const candidate = process.env.PLAYWRIGHT_MODULE;
  if (candidate) return importFrom(candidate);

  // Optional local pointer for a machine where Playwright lives elsewhere.
  // The file is gitignored; it never ships with the repository.
  const pointer = path.join(here, "..", ".playwright-module");
  const local = (await readFile(pointer, "utf8").catch(() => "")).trim();
  if (local) return importFrom(local);

  throw new Error(
    "Playwright is not installed. Run `npm i -D playwright` and `npx playwright install chromium` in examples/, or set PLAYWRIGHT_MODULE to an existing playwright/index.mjs.",
  );
}

export async function findChromium() {
  const cache = path.join(homedir(), ".cache/ms-playwright");
  let entries = [];
  try {
    entries = await readdir(cache);
  } catch {
    return undefined;
  }
  const revisions = entries
    .filter((name) => name.startsWith("chromium-"))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  for (const revision of revisions) {
    for (const binary of ["chrome-linux64/chrome", "chrome-linux/chrome"]) {
      const candidate = path.join(cache, revision, binary);
      const info = await stat(candidate).catch(() => null);
      if (info?.isFile()) return candidate;
    }
  }
  return undefined;
}
