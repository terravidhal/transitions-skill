// Presence helpers for the vanilla implementations.

export function motionAllowed(root = document.documentElement) {
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readMs(element, token, fallback = 240) {
  const value = getComputedStyle(element).getPropertyValue(token).trim();
  if (!value) return fallback;
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return fallback;
  return value.endsWith("ms") ? number : number * 1000;
}

export function whenSettled(element, token, fallback, done) {
  if (!motionAllowed()) {
    done();
    return () => {};
  }
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    element.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    done();
  };
  const onEnd = (event) => {
    if (event.target === element) finish();
  };
  element.addEventListener("transitionend", onEnd);
  const timer = setTimeout(finish, readMs(element, token, fallback) + 60);
  return finish;
}

/**
 * Minimal presence controller. `element` carries data-mf-state.
 * set(open) never animates a close when motion is reduced.
 */
export function createPresence(element, options = {}) {
  const {
    attribute = "data-mf-state",
    openValue = "open",
    closingValue = "closing",
    closedValue = "closed",
    closeToken = "--mf-toast-close-duration",
    fallback = 240,
  } = options;

  let cancel = () => {};

  function open() {
    cancel();
    element.setAttribute(attribute, openValue);
  }

  function close() {
    cancel();
    if (!motionAllowed()) {
      element.setAttribute(attribute, closedValue);
      return;
    }
    element.setAttribute(attribute, closingValue);
    cancel = whenSettled(element, closeToken, fallback, () => {
      element.setAttribute(attribute, closedValue);
    });
  }

  return {
    open,
    close,
    toggle(next) {
      if (next === undefined) next = element.getAttribute(attribute) !== openValue;
      if (next) open();
      else close();
    },
    destroy() {
      cancel();
    },
  };
}
