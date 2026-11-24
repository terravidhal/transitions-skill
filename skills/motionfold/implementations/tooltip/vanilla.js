// Tooltip wiring: ensure the trigger is described by the bubble, and keep
// the tooltip reachable from the keyboard. The motion stays in CSS.

let counter = 0;

export function setupTooltip(tooltip, { trigger } = {}) {
  if (!tooltip) return null;
  const bubble = tooltip.querySelector(".mf-tooltip-bubble");
  if (!bubble) return null;

  if (!bubble.id) {
    counter += 1;
    bubble.id = `mf-tooltip-${counter}`;
  }

  const target = trigger ?? tooltip.querySelector("button, a, input, [tabindex]") ?? tooltip;
  target.setAttribute("aria-describedby", bubble.id);
  if (!target.hasAttribute("tabindex") && !/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
    target.setAttribute("tabindex", "0");
  }

  return {
    destroy() {
      target.removeAttribute("aria-describedby");
    },
  };
}
