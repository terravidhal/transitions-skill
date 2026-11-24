// Toast behavior: create, pause on hover/focus, dismiss with an exit.
import { motionAllowed, whenSettled } from "../_shared/presence.vanilla.js";

let counter = 0;

export function createToast(region, { title = "", message = "", duration = 6000, tone } = {}) {
  if (!region) return null;
  counter += 1;
  const id = `mf-toast-${counter}`;

  const toast = document.createElement("div");
  toast.className = "mf-toast";
  toast.dataset.mfState = "closed";
  toast.dataset.mfId = id;
  toast.setAttribute("role", "status");
  if (tone) toast.dataset.mfTone = tone;

  const body = document.createElement("div");
  body.className = "mf-toast-body";
  if (title) {
    const heading = document.createElement("strong");
    heading.className = "mf-toast-title";
    heading.textContent = title;
    body.append(heading);
  }
  const text = document.createElement("span");
  text.textContent = message;
  body.append(text);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "mf-toast-close";
  close.setAttribute("aria-label", "Dismiss");
  close.textContent = "×";

  toast.append(body, close);
  region.append(toast);

  let timer = null;
  let remaining = duration;
  let startedAt = 0;
  let dismissed = false;

  function clear() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function pause() {
    if (!timer) return;
    clear();
    remaining -= Date.now() - startedAt;
  }

  function resume() {
    if (dismissed || duration <= 0 || timer) return;
    startedAt = Date.now();
    timer = setTimeout(dismiss, Math.max(600, remaining));
  }

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    clear();
    toast.dataset.mfState = "closing";
    whenSettled(toast, "--mf-toast-close-duration", 240, () => toast.remove());
  }

  close.addEventListener("click", dismiss);
  toast.addEventListener("mouseenter", pause);
  toast.addEventListener("mouseleave", resume);
  toast.addEventListener("focusin", pause);
  toast.addEventListener("focusout", resume);

  requestAnimationFrame(() => {
    if (dismissed) return;
    toast.dataset.mfState = "open";
    if (motionAllowed()) {
      startedAt = Date.now();
      timer = setTimeout(dismiss, duration);
    } else if (duration > 0) {
      startedAt = Date.now();
      timer = setTimeout(dismiss, duration);
    }
  });

  return {
    element: toast,
    dismiss,
    destroy() {
      clear();
      toast.remove();
    },
  };
}

export function setupToastRegion(region) {
  if (!region) return null;
  if (!region.hasAttribute("role")) region.setAttribute("role", "status");
  if (!region.hasAttribute("aria-live")) region.setAttribute("aria-live", "polite");
  if (!region.hasAttribute("aria-atomic")) region.setAttribute("aria-atomic", "false");
  return region;
}
