// Record a short showcase from the demo and assemble assets/demo.gif with ffmpeg.
// Run `npm run lint:gif`. Playwright is dev-only; ffmpeg is required on the machine.
import { execFile, spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { findChromium, loadPlaywright } from "./playwright.mjs";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL("../..", import.meta.url));
const framesDir = path.join(root, ".demo-frames");
const output = path.join(root, "assets/demo.gif");
const port = Number(process.env.PORT ?? 4179);
const origin = `http://127.0.0.1:${port}`;
const width = 960;
const height = 640;

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
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const server = spawn(process.execPath, [path.join(root, "examples/server.mjs")], {
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });

  const { chromium } = await loadPlaywright();
  const executablePath = await findChromium();
  let browser;
  let frame = 0;

  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
    await waitForServer(`${origin}/examples/index.html`);
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      colorScheme: "light",
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    await page.goto(`${origin}/examples/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.mfDemo?.setTheme("light"));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    async function shot() {
      await page.screenshot({
        path: path.join(framesDir, `f${String(frame).padStart(4, "0")}.png`),
        animations: "allow",
      });
      frame += 1;
    }

    async function hold(milliseconds) {
      const start = Date.now();
      while (Date.now() - start < milliseconds) {
        await shot();
        await page.waitForTimeout(55);
      }
    }

    async function focus(recipe) {
      await page.locator(`[data-recipe="${recipe}"]`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(220);
    }

    await focus("modal");
    await hold(250);
    await page.click("[data-open-modal]");
    await hold(750);
    await page.keyboard.press("Escape");
    await hold(280);

    await focus("like-button");
    await hold(180);
    await page.click("[data-like-demo]");
    await hold(650);

    await focus("copy-button");
    await page.click("[data-copy-demo]");
    await hold(620);

    await focus("success-check");
    await page.click("[data-success]");
    await hold(620);

    await focus("toast");
    await page.click("[data-toast]");
    await hold(950);

    await focus("spinner-to-check");
    await page.click("[data-spinner-run]");
    await hold(1200);

    await focus("theme-reveal");
    await hold(180);
    await page.click("[data-theme-reveal]");
    await hold(900);

    await context.close();
  } finally {
    await browser?.close().catch(() => {});
    server.kill("SIGTERM");
  }

  if (frame === 0) throw new Error("no frames were captured");

  await execFileAsync("ffmpeg", [
    "-y",
    "-framerate",
    "12",
    "-i",
    path.join(framesDir, "f%04d.png"),
    "-vf",
    `fps=12,scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=160[p];[s1][p]paletteuse=dither=bayer`,
    "-loop",
    "0",
    output,
  ]);

  await rm(framesDir, { recursive: true, force: true });
  console.log(`captured assets/demo.gif from ${frame} frames`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
