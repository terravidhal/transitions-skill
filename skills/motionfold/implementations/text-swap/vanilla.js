// Text-swap behavior: move the old label into a ghost layer, then swap.

export function createTextSwap(element) {
  if (!element) return null;
  const value = element.querySelector(".mf-text-swap-value");
  const ghost = element.querySelector(".mf-text-swap-ghost");
  if (!value) return null;

  let current = value.textContent ?? "";
  let timer;

  function set(next) {
    const text = String(next);
    if (text === current) return;
    if (ghost) ghost.textContent = current;
    element.dataset.mfSwapping = "false";
    void element.offsetWidth;
    value.textContent = text;
    element.dataset.mfSwapping = "true";
    current = text;
    clearTimeout(timer);
    timer = setTimeout(() => {
      element.dataset.mfSwapping = "false";
      if (ghost) ghost.textContent = "";
    }, 220);
  }

  function destroy() {
    clearTimeout(timer);
  }

  return { set, get: () => current, destroy };
}
