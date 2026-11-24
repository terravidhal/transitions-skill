// Switch behavior: a button with role="switch" and aria-checked.

export function setupSwitch(button, { checked, onChange } = {}) {
  if (!button) return null;

  if (!button.hasAttribute("role")) button.setAttribute("role", "switch");
  if (checked !== undefined || !button.hasAttribute("aria-checked")) {
    button.setAttribute("aria-checked", String(Boolean(checked)));
  }

  const render = () => {
    const value = button.getAttribute("aria-checked") === "true";
    button.querySelector(".mf-switch-thumb")?.setAttribute("aria-hidden", "true");
    return value;
  };

  const toggle = () => {
    const next = button.getAttribute("aria-checked") !== "true";
    button.setAttribute("aria-checked", String(next));
    onChange?.(next);
    button.dispatchEvent(new CustomEvent("change", { detail: next, bubbles: true }));
  };

  const onClick = () => toggle();
  const onKey = (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle();
    }
  };

  render();
  button.addEventListener("click", onClick);
  button.addEventListener("keydown", onKey);

  return {
    set(value) {
      button.setAttribute("aria-checked", String(Boolean(value)));
    },
    get() {
      return button.getAttribute("aria-checked") === "true";
    },
    destroy() {
      button.removeEventListener("click", onClick);
      button.removeEventListener("keydown", onKey);
    },
  };
}
