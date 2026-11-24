// Icon swap behavior for a button with two stacked icon layers.

export function setupIconSwap(button, { onChange } = {}) {
  if (!button) return null;
  let active = button.getAttribute("data-mf-active") === "true";

  function render() {
    button.setAttribute("data-mf-active", String(active));
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", button.getAttribute(active ? "data-label-on" : "data-label-off") ?? button.getAttribute("aria-label") ?? "");
  }

  function toggle() {
    active = !active;
    render();
    onChange?.(active, button);
  }

  const onClick = () => toggle();
  button.addEventListener("click", onClick);
  render();

  return {
    toggle,
    get active() {
      return active;
    },
    destroy() {
      button.removeEventListener("click", onClick);
    },
  };
}
