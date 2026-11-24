// Success-check behavior: measure the path, then replay the one-shot animation.

export function setupSuccess(element) {
  if (!element) return null;
  const path = element.querySelector(".mf-success-path");
  const icon = element.querySelector(".mf-success-icon");

  function measure() {
    if (!path || typeof path.getTotalLength !== "function") return;
    const length = Math.ceil(path.getTotalLength()) + 1;
    (icon ?? element).style.setProperty("--mf-check-path-length", String(length));
  }

  function show() {
    element.dataset.mfState = "idle";
    void element.offsetWidth;
    element.dataset.mfState = "success";
  }

  function reset() {
    element.dataset.mfState = "idle";
  }

  measure();
  if (element.dataset.mfState === "success") show();

  return {
    show,
    replay: show,
    reset,
    measure,
  };
}
