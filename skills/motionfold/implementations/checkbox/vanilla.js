// Checkbox behavior: the native input owns the state. We only measure the path.

export function setupCheckbox(root) {
  if (!root) return null;
  const checkboxes = [...root.querySelectorAll(".mf-checkbox")];
  const cleanups = [];

  for (const checkbox of checkboxes) {
    const path = checkbox.querySelector(".mf-checkbox-check");
    if (!path || typeof path.getTotalLength !== "function") continue;
    const box = checkbox.querySelector(".mf-checkbox-box");
    const measure = () => {
      const length = Math.ceil(path.getTotalLength()) + 1;
      if (box) box.style.setProperty("--mf-checkbox-path-length", String(length));
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  }

  return {
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
}
