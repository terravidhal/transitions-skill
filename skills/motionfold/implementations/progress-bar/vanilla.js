// Progress bar behavior. The value is written to CSS and to ARIA.

export function setupProgress(element, { value = 0, onChange } = {}) {
  if (!element) return null;
  const bar = element.querySelector(".mf-progress-track") ?? element;
  const output = element.querySelector(".mf-progress-value");

  function set(next) {
    const clamped = Math.max(0, Math.min(100, Number(next)));
    bar.style.setProperty("--mf-progress", String(clamped));
    bar.setAttribute("aria-valuenow", String(Math.round(clamped)));
    if (output) output.textContent = Math.round(clamped) + "%";
    onChange?.(clamped);
  }

  set(value);

  return { set };
}
