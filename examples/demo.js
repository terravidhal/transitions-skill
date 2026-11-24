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
import { setupSheet } from "../skills/motionfold/implementations/bottom-sheet/vanilla.js";
import { setupCommandPalette } from "../skills/motionfold/implementations/command-palette/vanilla.js";
import { setupBanner } from "../skills/motionfold/implementations/banner/vanilla.js";
import { setupLightbox } from "../skills/motionfold/implementations/lightbox/vanilla.js";
import { setupDropdown } from "../skills/motionfold/implementations/dropdown/vanilla.js";
import { setupRadioGroup } from "../skills/motionfold/implementations/radio-group/vanilla.js";
import { setupSegmented } from "../skills/motionfold/implementations/segmented-control/vanilla.js";
import { setupIconSwap } from "../skills/motionfold/implementations/icon-swap/vanilla.js";
import { setupLike } from "../skills/motionfold/implementations/like-button/vanilla.js";
import { setupCopy } from "../skills/motionfold/implementations/copy-button/vanilla.js";
import { setupSpinnerCheck } from "../skills/motionfold/implementations/spinner-to-check/vanilla.js";
import { setupNumberPop } from "../skills/motionfold/implementations/number-pop/vanilla.js";
import { setupProgress } from "../skills/motionfold/implementations/progress-bar/vanilla.js";
import { setupStepper } from "../skills/motionfold/implementations/stepper/vanilla.js";
import { revealTheme } from "../skills/motionfold/implementations/theme-reveal/vanilla.js";
import { setupInlineEdit } from "../skills/motionfold/implementations/inline-edit/vanilla.js";

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

// ── Bottom sheet ──
const sheet = setupSheet(document.querySelector("dialog.mf-sheet"));
document.querySelector("[data-open-sheet]")?.addEventListener("click", () => sheet?.open());

// ── Command palette ──
const command = setupCommandPalette(document.querySelector("dialog.mf-command"), {
  onRun: (id) => createToast(toastRegion, { title: "Command", message: id + " ran successfully.", duration: 4000 }),
});
document.querySelector("[data-open-command]")?.addEventListener("click", () => command?.open());
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    command?.open();
  }
});

// ── Banner ──
const banner = setupBanner(document.querySelector("[data-banner-demo]"));
document.querySelector("[data-banner-show]")?.addEventListener("click", () => banner?.open());

// ── Lightbox ──
const lightbox = setupLightbox(document.querySelector("dialog.mf-lightbox"));
document.querySelector("[data-open-lightbox]")?.addEventListener("click", () => lightbox?.open());

// ── Dropdown ──
setupDropdown(document.querySelector("[data-dropdown-demo]"));

// ── Radio group ──
setupRadioGroup(document.querySelector("[data-radio-demo]"));

// ── Segmented control ──
setupSegmented(document.querySelector("[data-segmented-demo]"));

// ── Icon swap ──
setupIconSwap(document.querySelector("[data-icon-swap-demo]"));

// ── Like button ──
setupLike(document.querySelector("[data-like-demo]"), { count: 128 });

// ── Copy button ──
setupCopy(document.querySelector("[data-copy-demo]"), {
  text: "https://motionfold.dev/project/atlas",
  onCopy: () => createToast(toastRegion, { title: "Link copied", message: "The project link is on your clipboard.", duration: 4000 }),
});

// ── Spinner to check ──
const spinner = setupSpinnerCheck(document.querySelector("[data-spinner-demo]"));
let spinnerTimer;
document.querySelector("[data-spinner-run]")?.addEventListener("click", () => {
  clearTimeout(spinnerTimer);
  spinner?.reset();
  spinnerTimer = setTimeout(() => spinner?.done(), 900);
});

// ── Number pop ──
const number = setupNumberPop(document.querySelector("[data-number-demo]"));
let numberValue = 2;
document.querySelector("[data-number-add]")?.addEventListener("click", () => {
  numberValue += 1;
  number?.set(numberValue);
});

// ── Progress bar ──
const progress = setupProgress(document.querySelector("[data-progress-demo]"), { value: 20 });
let progressValue = 20;
document.querySelector("[data-progress-advance]")?.addEventListener("click", () => {
  progressValue = progressValue >= 100 ? 20 : Math.min(100, progressValue + 40);
  progress?.set(progressValue);
});

// ── Stepper ──
const stepper = setupStepper(document.querySelector("[data-stepper-demo]"));
document.querySelector("[data-stepper-back]")?.addEventListener("click", () => stepper?.back());
document.querySelector("[data-stepper-next]")?.addEventListener("click", () => stepper?.next());

// ── Theme reveal ──
document.querySelector("[data-theme-reveal]")?.addEventListener("click", (event) => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  revealTheme(event.currentTarget, () => setTheme(next));
});

// ── Inline edit ──
setupInlineEdit(document.querySelector("[data-inline-demo]"), { value: "Project Atlas" });

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
