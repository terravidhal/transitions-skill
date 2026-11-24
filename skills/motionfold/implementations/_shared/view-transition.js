// View Transitions helper: one call, a documented fallback, reduced-motion aware.

export function motionAllowed(root = document.documentElement) {
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function supportsViewTransition() {
  return typeof document !== "undefined" && typeof document.startViewTransition === "function";
}

/**
 * Run a DOM update inside a view transition when possible.
 * direction: "forward" | "back" | "none"
 */
export function withViewTransition(update, { direction = "forward" } = {}) {
  if (typeof document === "undefined") {
    update();
    return Promise.resolve();
  }
  document.documentElement.dataset.mfDirection = direction;
  if (!motionAllowed() || !supportsViewTransition()) {
    update();
    return Promise.resolve();
  }
  return document.startViewTransition(update).updateCallbackDone;
}
