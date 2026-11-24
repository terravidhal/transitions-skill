// Resolve Playwright without adding it to the shipped skill.
// Install it for the demo only: npm i -D playwright && npx playwright install chromium
// Or point PLAYWRIGHT_MODULE at an existing playwright/index.mjs.

import { readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

export async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    // fall through
  }
  const candidate = process.env.PLAYWRIGHT_MODULE;
  if (candidate) {
    const url = candidate.startsWith("file:") ? candidate : `file://${candidate}`;
    return import(url);
  }
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
