// Capture the README screenshots with Playwright Chromium.
// Run `npm run lint:capture` (needs Playwright installed) or
// `npm run lint:capture` with PLAYWRIGHT_MODULE set.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findChromium, loadPlaywright } from "./playwright.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const outDir = path.join(root, "assets/readme");
const port = Number(process.env.PORT ?? 4177);
const origin = `http://127.0.0.1:${port}`;

async function waitForServer(url, timeout = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`server did not start: ${url}`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const server = spawn(process.execPath, [path.join(root, "examples/server.mjs")], {
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });

  const { chromium } = await loadPlaywright();
  const executablePath = await findChromium();
  let browser;
  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
    await waitForServer(`${origin}/examples/index.html`);

    const shots = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 390, height: 844 },
    ];
    const themes = ["light", "dark"];

    for (const shot of shots) {
      for (const theme of themes) {
        const context = await browser.newContext({
          viewport: { width: shot.width, height: shot.height },
          deviceScaleFactor: 1,
          colorScheme: theme,
          reducedMotion: "no-preference",
        });
        const page = await context.newPage();
        await page.goto(`${origin}/examples/index.html`, { waitUntil: "networkidle" });
        await page.evaluate((value) => window.mfDemo?.setTheme(value), theme);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(900);
        await page.screenshot({
          path: path.join(outDir, `demo-${shot.name}-${theme}.png`),
          fullPage: true,
        });
        await context.close();
        console.log(`captured demo-${shot.name}-${theme}.png`);
      }
    }

    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 1,
      colorScheme: "light",
    });
    const page = await context.newPage();
    await page.goto(`${origin}/examples/before-after.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(root, "assets/before-after.png"), fullPage: true });
    await context.close();
    console.log("captured before-after.png");
  } finally {
    await browser?.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
