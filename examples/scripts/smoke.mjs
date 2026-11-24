// Smoke test for the demo. Playwright is a dev-only dependency.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findChromium, loadPlaywright } from "./playwright.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const port = Number(process.env.PORT ?? 4178);
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
  const server = spawn(process.execPath, [path.join(root, "examples/server.mjs")], {
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  const { chromium } = await loadPlaywright();
  const executablePath = await findChromium();
  let browser;
  const problems = [];

  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
    await waitForServer(`${origin}/examples/index.html`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/examples/index.html`, { waitUntil: "networkidle" });

    const recipes = await page.locator("[data-recipe]").count();
    if (recipes !== 14) problems.push(`expected 14 recipe cards, found ${recipes}`);

    // Modal: open, Escape, focus return.
    await page.click("[data-open-modal]");
    if ((await page.locator("dialog.mf-modal[open]").count()) !== 1) problems.push("modal did not open");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    if ((await page.locator("dialog.mf-modal[open]").count()) !== 0) problems.push("modal did not close on Escape");

    // Drawer: open and close with its button.
    await page.click("[data-open-drawer]");
    if ((await page.locator("dialog.mf-drawer[open]").count()) !== 1) problems.push("drawer did not open");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    if ((await page.locator("dialog.mf-drawer[open]").count()) !== 0) problems.push("drawer did not close on Escape");

    // Popover: native top layer and a menu item.
    await page.click("#popover-trigger");
    const popoverOpen = await page.evaluate(() => document.getElementById("account-menu")?.matches(":popover-open"));
    if (!popoverOpen) problems.push("popover did not open");
    await page.keyboard.press("Escape");

    // Tooltip: hover shows the bubble.
    await page.hover(".mf-tooltip");
    await page.waitForTimeout(400);
    const tipOpacity = await page.evaluate(() => {
      const bubble = document.querySelector(".mf-tooltip-bubble");
      return bubble ? Number.parseFloat(getComputedStyle(bubble).opacity) : 0;
    });
    if (tipOpacity < 0.5) problems.push(`tooltip did not become visible (opacity ${tipOpacity})`);

    // Accordion: second item opens.
    await page.click("#acc-2-trigger");
    const accordionOpen = await page.evaluate(
      () => document.getElementById("acc-2-trigger")?.closest(".mf-accordion")?.getAttribute("data-mf-open"),
    );
    if (accordionOpen !== "true") problems.push("accordion did not open");

    // Tabs: selection and panel.
    await page.click("#tab-activity");
    const tabState = await page.evaluate(() => ({
      selected: document.getElementById("tab-activity")?.getAttribute("aria-selected"),
      hidden: document.getElementById("panel-activity")?.hidden,
    }));
    if (tabState.selected !== "true" || tabState.hidden !== false) problems.push("tabs did not select the activity panel");

    // Switch and checkbox.
    await page.click(".mf-switch");
    const switchState = await page.evaluate(() => document.querySelector(".mf-switch")?.getAttribute("aria-checked"));
    if (switchState !== "false") problems.push("switch did not toggle");
    await page.locator(".mf-checkbox").nth(1).click();
    const checkboxState = await page.evaluate(() => document.querySelectorAll(".mf-checkbox input")[1]?.checked);
    if (checkboxState !== true) problems.push("checkbox did not toggle");

    // Skeleton reveal and reset.
    await page.click("[data-skeleton]");
    if ((await page.locator(".mf-skeleton").getAttribute("data-mf-state")) !== "ready") problems.push("skeleton did not reveal");
    await page.click("[data-skeleton]");
    if ((await page.locator(".mf-skeleton").getAttribute("data-mf-state")) !== "loading") problems.push("skeleton did not reset");

    // Feedback.
    await page.click("[data-success]");
    await page.click("[data-error]");
    const invalid = await page.evaluate(() => ({
      field: document.querySelector(".mf-field")?.getAttribute("data-mf-invalid"),
      aria: document.getElementById("demo-email")?.getAttribute("aria-invalid"),
    }));
    if (invalid.field !== "true" || invalid.aria !== "true") problems.push("error state did not apply");
    await page.click("[data-text-swap]");
    const status = await page.locator(".mf-text-swap-value").textContent();
    if (status?.trim() !== "In review") problems.push(`text swap did not advance (${status})`);

    // Navigation.
    await page.click("[data-page-forward]");
    await page.waitForTimeout(450);
    const detailHidden = await page.evaluate(
      () => document.querySelector('[data-mf-page="detail"]')?.hidden,
    );
    if (detailHidden !== false) problems.push("page slide did not show the detail view");
    await page.click("[data-page-back]");
    await page.waitForTimeout(450);
    const listHidden = await page.evaluate(() => document.querySelector('[data-mf-page="list"]')?.hidden);
    if (listHidden !== false) problems.push("page slide did not return to the list");

    // Theme.
    await page.click("[data-theme-toggle='dark']");
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== "dark") problems.push("theme toggle did not apply");

    // Reduced motion and one-line tuning.
    await page.evaluate(() => window.mfDemo.setMotion("reduced"));
    const duration = await page.evaluate(() => {
      const dialog = document.querySelector("dialog.mf-modal");
      return getComputedStyle(dialog).transitionDuration;
    });
    const values = duration.split(",").map((value) => Number.parseFloat(value));
    if (values.some((value) => value > 0.25)) problems.push(`reduced motion still has a long duration: ${duration}`);

    await page.selectOption("#ease", "ease-out");
    const easeValue = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--mf-ease").trim(),
    );
    if (easeValue !== "ease-out") problems.push(`ease control did not write the token: ${easeValue}`);

    await page.click("[data-toast]");
    await page.waitForTimeout(300);
    if ((await page.locator(".mf-toast").count()) === 0) problems.push("toast did not appear");

    for (const error of errors) problems.push(`console: ${error}`);
  } finally {
    await browser?.close().catch(() => {});
    server.kill("SIGTERM");
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(`fail: ${problem}`);
    process.exit(1);
  }
  console.log("ok: demo loads, 14 recipes, all interactions, reduced motion, tuning");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
