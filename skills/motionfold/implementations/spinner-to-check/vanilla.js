// Spinner to check behavior. The wrapper carries data-mf-state.

export function setupSpinnerCheck(element, { onDone } = {}) {
  if (!element) return null;

  function set(state) {
    element.setAttribute("data-mf-state", state);
    element.setAttribute("aria-busy", String(state === "loading"));
    const label = element.querySelector(".mf-spinner-label");
    if (label) label.textContent = state === "done" ? "Done" : "Working";
    if (state === "done") onDone?.();
  }

  function done() {
    set("done");
  }

  function reset() {
    set("loading");
  }

  set(element.getAttribute("data-mf-state") ?? "loading");

  return { set, done, reset };
}
