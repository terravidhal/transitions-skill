// Stepper behavior. One step is active; the spine scales to the current index.

export function setupStepper(root, { step = 0, onChange } = {}) {
  if (!root) return null;
  const stepper = root.querySelector(".mf-stepper") ?? root;
  const steps = [...root.querySelectorAll(".mf-step")];
  const panels = [...root.querySelectorAll(".mf-step-panel")];
  const line = root.querySelector(".mf-stepper-line span");
  let index = step;

  function render() {
    steps.forEach((item, position) => {
      item.setAttribute("data-active", String(position === index));
      item.setAttribute("data-done", String(position < index));
    });
    panels.forEach((panel, position) => {
      panel.setAttribute("data-active", String(position === index));
      panel.hidden = position !== index;
    });
    if (line) line.style.setProperty("--mf-stepper-progress", String(step > 0 ? index / Math.max(1, steps.length - 1) : 0));
    stepper.setAttribute("data-mf-step", String(index));
    onChange?.(index);
  }

  function set(next) {
    index = Math.max(0, Math.min(steps.length - 1, next));
    render();
    panels[index]?.querySelector("h3")?.focus?.();
  }

  render();

  return {
    set,
    next: () => set(index + 1),
    back: () => set(index - 1),
    get index() {
      return index;
    },
  };
}
