import { setupModal } from "../skills/motionfold/implementations/modal/vanilla.js";
import { setupDrawer } from "../skills/motionfold/implementations/drawer/vanilla.js";
import { setupPopover } from "../skills/motionfold/implementations/popover/vanilla.js";
import { setupTooltip } from "../skills/motionfold/implementations/tooltip/vanilla.js";
import { createToast, setupToastRegion } from "../skills/motionfold/implementations/toast/vanilla.js";
import { setupAccordion } from "../skills/motionfold/implementations/accordion/vanilla.js";
import { setupTabs } from "../skills/motionfold/implementations/tabs/vanilla.js";
import { setupSwitch } from "../skills/motionfold/implementations/switch/vanilla.js";
import { setupCheckbox } from "../skills/motionfold/implementations/checkbox/vanilla.js";
import { setupSkeleton } from "../skills/motionfold/implementations/skeleton/vanilla.js";
import { setupSuccess } from "../skills/motionfold/implementations/success-check/vanilla.js";
import { setupErrorShake } from "../skills/motionfold/implementations/error-shake/vanilla.js";
import { createTextSwap } from "../skills/motionfold/implementations/text-swap/vanilla.js";
import { setupPageSlide } from "../skills/motionfold/implementations/page-slide/vanilla.js";

const root = document.documentElement;

// ── Theme ────────────────────────────────────────────────────────────────
const themeButtons = [...document.querySelectorAll("[data-theme-toggle]")];
function setTheme(theme) {
  root.dataset.theme = theme;
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.themeToggle === theme));
  }
}
for (const button of themeButtons) {
  button.addEventListener("click", () => setTheme(button.dataset.themeToggle));
}

// ── Motion preference ────────────────────────────────────────────────────
const motionButtons = [...document.querySelectorAll("[data-motion-toggle]")];
function setMotion(value) {
  root.dataset.motion = value;
  for (const button of motionButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.motionToggle === value));
  }
}
for (const button of motionButtons) {
  button.addEventListener("click", () => setMotion(button.dataset.motionToggle));
}

// ── Scale and curve ──────────────────────────────────────────────────────
const speed = document.getElementById("speed");
const speedOut = document.getElementById("speed-out");
const scaleOut = document.getElementById("scale-out");
const ease = document.getElementById("ease");
const easeOut = document.getElementById("ease-out");

function applySpeed() {
  const factor = Number(speed.value);
  const scale = (1 / factor).toFixed(3);
  root.style.setProperty("--mf-scale", scale);
  speedOut.textContent = `${factor.toFixed(2)}×`;
  scaleOut.textContent = scale;
}
speed.addEventListener("input", applySpeed);
applySpeed();

function applyEase() {
  root.style.setProperty("--mf-ease", ease.value);
  easeOut.textContent = ease.options[ease.selectedIndex].textContent.toLowerCase();
}
ease.addEventListener("change", applyEase);
applyEase();

// ── Surfaces ─────────────────────────────────────────────────────────────
const modal = setupModal(document.querySelector("dialog.mf-modal"));
document.querySelector("[data-open-modal]")?.addEventListener("click", () => modal?.open());

const drawer = setupDrawer(document.querySelector("dialog.mf-drawer"));
document.querySelector("[data-open-drawer]")?.addEventListener("click", () => drawer?.open());

setupPopover(document.getElementById("popover-trigger"), document.getElementById("account-menu"));
setupTooltip(document.querySelector(".mf-tooltip"));

const toastRegion = setupToastRegion(document.querySelector("[data-toast-region]"));
document.querySelector("[data-toast]")?.addEventListener("click", () => {
  createToast(toastRegion, { title: "Saved", message: "Draft updated just now.", duration: 6000 });
});

// ── State controls ───────────────────────────────────────────────────────
setupAccordion(document.getElementById("accordion-demo"));
setupTabs(document.getElementById("tabs-demo"));
for (const button of document.querySelectorAll(".mf-switch")) setupSwitch(button);
setupCheckbox(document.querySelector('[data-recipe="checkbox"]'));

const skeleton = setupSkeleton(document.querySelector(".mf-skeleton"));
const skeletonButton = document.querySelector("[data-skeleton]");
skeletonButton?.addEventListener("click", () => {
  const ready = skeletonButton.textContent === "Reset";
  skeleton?.set(!ready);
  skeletonButton.textContent = ready ? "Reveal" : "Reset";
});

// ── Feedback ─────────────────────────────────────────────────────────────
const success = setupSuccess(document.querySelector(".mf-success"));
document.querySelector("[data-success]")?.addEventListener("click", () => success?.replay());

const field = setupErrorShake(document.querySelector(".mf-field"));
document.querySelector("[data-error]")?.addEventListener("click", () => {
  field?.show("Enter a valid email address.");
});
document.getElementById("demo-email")?.addEventListener("input", () => field?.clear());

const statuses = ["Draft", "In review", "Published", "Archived"];
const textSwap = createTextSwap(document.querySelector(".mf-text-swap"));
const textSwapButton = document.querySelector("[data-text-swap]");
let statusIndex = 0;
textSwapButton?.addEventListener("click", () => {
  statusIndex = (statusIndex + 1) % statuses.length;
  textSwap?.set(statuses[statusIndex]);
  textSwapButton.textContent = statusIndex === statuses.length - 1 ? "Reset" : "Advance";
});

// ── Navigation ───────────────────────────────────────────────────────────
const page = setupPageSlide(document.getElementById("page-demo"));
document.querySelector("[data-page-forward]")?.addEventListener("click", () => page?.show(1, { direction: "forward" }));
document.querySelector("[data-page-back]")?.addEventListener("click", () => page?.show(0, { direction: "back" }));

// ── Replay highlights ────────────────────────────────────────────────────
function replayAll() {
  createToast(toastRegion, { title: "Highlights", message: "Replaying the quiet moments.", duration: 5000 });
  success?.replay();
  textSwap?.set("In review");
  page?.show(1, { direction: "forward" });
  skeleton?.set(false);
  skeletonButton.textContent = "Reveal";
  setTimeout(() => {
    skeleton?.set(true);
    field?.show("Enter a valid email address.");
  }, 900);
  setTimeout(() => {
    field?.clear();
    textSwap?.set("Published");
  }, 2100);
  setTimeout(() => {
    page?.show(0, { direction: "back" });
    textSwap?.set("Draft");
  }, 3100);
}

document.getElementById("replay-all")?.addEventListener("click", replayAll);

// Exposed for the screenshot script and for manual console experiments.
window.mfDemo = {
  replayAll,
  setTheme,
  setMotion,
  openModal: () => modal?.open(),
  openDrawer: () => drawer?.open(),
};

window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", () => {
  if (root.dataset.motion === "auto") {
    root.dataset.motion = "auto";
  }
});
