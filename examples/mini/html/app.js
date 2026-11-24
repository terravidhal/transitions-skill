import { setupModal } from "../../../skills/motionfold/implementations/modal/vanilla.js";
import { setupTabs } from "../../../skills/motionfold/implementations/tabs/vanilla.js";
import { setupSwitch } from "../../../skills/motionfold/implementations/switch/vanilla.js";
import { createToast, setupToastRegion } from "../../../skills/motionfold/implementations/toast/vanilla.js";
import { setupSuccess } from "../../../skills/motionfold/implementations/success-check/vanilla.js";

const modal = setupModal(document.querySelector("dialog.mf-modal"));
document.querySelector("[data-open-modal]")?.addEventListener("click", () => modal?.open());

setupTabs(document.querySelector("[data-tabs]"));
setupSwitch(document.querySelector("[data-switch]"));

const region = setupToastRegion(document.querySelector("[data-toast-region]"));
document.querySelector("[data-toast]")?.addEventListener("click", () => {
  createToast(region, { title: "Saved", message: "Draft updated just now.", duration: 5000 });
});

const success = setupSuccess(document.querySelector("[data-success]"));
document.querySelector("[data-success-replay]")?.addEventListener("click", () => success?.replay());
