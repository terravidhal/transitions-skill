// Skeleton behavior: toggle data-mf-state, keep aria-busy truthful.

export function setupSkeleton(element, { ready = false, announce = null } = {}) {
  if (!element) return null;
  const live = announce ?? element.querySelector("[data-mf-announce]");

  function set(next) {
    element.dataset.mfState = next ? "ready" : "loading";
    element.setAttribute("aria-busy", String(!next));
    if (live) live.textContent = next ? live.dataset.readyText || "Content loaded" : live.dataset.loadingText || "Loading";
  }

  set(ready);

  return {
    reveal() {
      set(true);
    },
    reset() {
      set(false);
    },
    set,
  };
}
