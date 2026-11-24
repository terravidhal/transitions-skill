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
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/examples/index.html`, { waitUntil: "networkidle" });

    const recipes = await page.locator("[data-recipe]").count();
    if (recipes !== 30) problems.push(`expected 30 recipe cards, found ${recipes}`);

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

    // Bottom sheet.
    await page.click("[data-open-sheet]");
    if ((await page.locator("dialog.mf-sheet[open]").count()) !== 1) problems.push("bottom sheet did not open");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    if ((await page.locator("dialog.mf-sheet[open]").count()) !== 0) problems.push("bottom sheet did not close");

    // Command palette.
    await page.click("[data-open-command]");
    if ((await page.locator("dialog.mf-command[open]").count()) !== 1) problems.push("command palette did not open");
    await page.fill(".mf-command-input", "settings");
    const commandVisible = await page.locator(".mf-command-item:not([hidden])").count();
    if (commandVisible !== 1) problems.push(`command palette filter returned ${commandVisible} items`);
    await page.keyboard.press("Escape");

    // Banner.
    await page.click("[data-banner-show]");
    if ((await page.locator("[data-banner-demo]").getAttribute("data-mf-state")) !== "open") problems.push("banner did not open");
    await page.click("[data-banner-demo] [data-mf-dismiss]");
    await page.waitForTimeout(350);
    if ((await page.locator("[data-banner-demo]").getAttribute("data-mf-state")) !== "closed") problems.push("banner did not close");

    // Lightbox.
    await page.click("[data-open-lightbox]");
    if ((await page.locator("dialog.mf-lightbox[open]").count()) !== 1) problems.push("lightbox did not open");
    await page.keyboard.press("Escape");

    // Dropdown.
    await page.click("[data-dropdown-demo] .mf-dropdown-trigger");
    if ((await page.locator("[data-dropdown-demo]").getAttribute("data-mf-state")) !== "open") problems.push("dropdown did not open");
    await page.click('[data-dropdown-demo] .mf-dropdown-item[data-value="alpha"]');
    const dropdownValue = await page.locator("[data-dropdown-demo] .mf-dropdown-value").textContent();
    if (dropdownValue?.trim() !== "A–Z") problems.push(`dropdown did not select (${dropdownValue})`);
    await page.focus("[data-dropdown-demo] .mf-dropdown-trigger");
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(50);
    const dropdownFocus = await page.evaluate(() => document.activeElement?.className ?? "");
    if (!String(dropdownFocus).includes("mf-dropdown-item")) problems.push("dropdown did not move focus to an option");
    await page.keyboard.press("Escape");

    // Radio group and segmented control.
    await page.locator("[data-radio-demo] .mf-radio").nth(1).click();
    const radioChecked = await page.locator('[data-radio-demo] input[value="yearly"]').isChecked();
    if (!radioChecked) problems.push("radio group did not change");
    await page.click('[data-segmented-demo] .mf-segmented-item:nth-of-type(2)');
    const segmentIndex = await page.evaluate(() => getComputedStyle(document.querySelector("[data-segmented-demo]")).getPropertyValue("--mf-seg-index").trim());
    if (segmentIndex !== "1") problems.push(`segmented control did not move (${segmentIndex})`);

    // Icon swap, like, copy.
    await page.click("[data-icon-swap-demo]");
    if ((await page.locator("[data-icon-swap-demo]").getAttribute("data-mf-active")) !== "true") problems.push("icon swap did not toggle");
    await page.click("[data-like-demo]");
    const likeState = await page.evaluate(() => ({
      liked: document.querySelector("[data-like-demo]")?.getAttribute("data-mf-liked"),
      count: document.querySelector("[data-like-demo] .mf-like-count")?.textContent,
    }));
    if (likeState.liked !== "true" || likeState.count !== "129") problems.push("like button did not update");
    await page.click("[data-copy-demo]");
    await page.waitForTimeout(120);
    if ((await page.locator("[data-copy-demo]").getAttribute("data-mf-copied")) !== "true") problems.push("copy button did not confirm");

    // Spinner, number, progress, stepper.
    await page.click("[data-spinner-run]");
    await page.waitForTimeout(1100);
    if ((await page.locator("[data-spinner-demo]").getAttribute("data-mf-state")) !== "done") problems.push("spinner did not resolve");
    await page.click("[data-number-add]");
    const numberText = await page.locator("[data-number-demo] .mf-number-value").textContent();
    if (numberText?.trim() !== "3") problems.push(`number pop did not update (${numberText})`);
    await page.click("[data-progress-advance]");
    const progressNow = await page.locator("[data-progress-demo] .mf-progress-track").getAttribute("aria-valuenow");
    if (progressNow !== "60") problems.push(`progress bar did not advance (${progressNow})`);
    await page.click("[data-stepper-next]");
    if ((await page.locator("[data-stepper-demo] .mf-stepper").getAttribute("data-mf-step")) !== "1") problems.push("stepper did not advance");

    // Inline edit.
    await page.click("[data-inline-demo] .mf-inline-edit-view");
    if ((await page.locator("[data-inline-demo]").getAttribute("data-mf-editing")) !== "true") problems.push("inline edit did not enter editing");
    await page.fill("[data-inline-demo] .mf-inline-edit-input", "Project Borealis");
    await page.press("[data-inline-demo] .mf-inline-edit-input", "Enter");
    const inlineLabel = await page.locator("[data-inline-demo] .mf-inline-edit-label").textContent();
    if (inlineLabel?.trim() !== "Project Borealis") problems.push(`inline edit did not save (${inlineLabel})`);

    // Theme reveal, then the regular theme toggle.
    await page.click("[data-theme-reveal]");
    await page.waitForTimeout(500);
    const revealThemeValue = await page.evaluate(() => document.documentElement.dataset.theme);
    if (revealThemeValue !== "dark") problems.push(`theme reveal did not switch (${revealThemeValue})`);
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

    // The HTML mini project uses the same files with no build.
    await page.goto(`${origin}/examples/mini/html/index.html`, { waitUntil: "networkidle" });
    if ((await page.locator("[data-mini]").count()) !== 5) problems.push("HTML mini does not show five recipes");
    await page.click("[data-open-modal]");
    if ((await page.locator("dialog.mf-modal[open]").count()) !== 1) problems.push("HTML mini modal did not open");
    await page.keyboard.press("Escape");
    await page.click("[data-toast]");
    await page.waitForTimeout(300);
    if ((await page.locator(".mf-toast").count()) === 0) problems.push("HTML mini toast did not appear");

    // Every dialog has a name and modal semantics.
    const dialogs = await page.evaluate(() =>
      [...document.querySelectorAll("dialog")].map((dialog) => ({
        name: dialog.getAttribute("aria-labelledby") ?? dialog.getAttribute("aria-label"),
        modal: dialog.getAttribute("aria-modal"),
      })),
    );
    if (dialogs.some((dialog) => !dialog.name || dialog.modal !== "true")) {
      problems.push("a demo dialog is missing aria-modal or an accessible name");
    }

    // OS-level reduced motion: the starting-style surfaces must not displace or scale.
    const reduced = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
    });
    const reducedPage = await reduced.newPage();
    reducedPage.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    reducedPage.on("pageerror", (error) => errors.push(error.message));
    await reducedPage.goto(`${origin}/examples/index.html`, { waitUntil: "networkidle" });
    const isIdentity = (value) => value === "none" || value === "matrix(1, 0, 0, 1, 0, 0)";

    await reducedPage.click("[data-open-modal]");
    await reducedPage.waitForTimeout(40);
    const modalTransform = await reducedPage.evaluate(() => getComputedStyle(document.querySelector("dialog.mf-modal")).transform);
    if (!isIdentity(modalTransform)) problems.push(`modal moves under reduced motion (${modalTransform})`);
    await reducedPage.keyboard.press("Escape");
    await reducedPage.waitForTimeout(250);

    await reducedPage.click("[data-open-drawer]");
    await reducedPage.waitForTimeout(40);
    const drawerTransform = await reducedPage.evaluate(() => getComputedStyle(document.querySelector("dialog.mf-drawer")).transform);
    if (!isIdentity(drawerTransform)) problems.push(`drawer moves under reduced motion (${drawerTransform})`);
    await reducedPage.keyboard.press("Escape");
    await reducedPage.waitForTimeout(250);

    await reducedPage.click("[data-open-sheet]");
    await reducedPage.waitForTimeout(40);
    const sheetTransform = await reducedPage.evaluate(() => getComputedStyle(document.querySelector("dialog.mf-sheet")).transform);
    if (!isIdentity(sheetTransform)) problems.push(`bottom sheet moves under reduced motion (${sheetTransform})`);
    await reducedPage.keyboard.press("Escape");
    await reducedPage.waitForTimeout(250);

    const skeletonAnimation = await reducedPage.evaluate(() => getComputedStyle(document.querySelector(".mf-skeleton-line")).animationName);
    if (skeletonAnimation !== "none") problems.push(`skeleton still loops under reduced motion (${skeletonAnimation})`);
    await reduced.close();

    for (const error of errors) problems.push(`console: ${error}`);
  } finally {
    await browser?.close().catch(() => {});
    server.kill("SIGTERM");
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(`fail: ${problem}`);
    process.exit(1);
  }
  console.log("ok: demo loads, 30 recipes, all interactions, reduced motion, tuning");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
