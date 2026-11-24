// Accordion behavior. The CSS owns the height and the chevron.

export function setupAccordion(root) {
  if (!root) return null;
  const items = [...root.querySelectorAll(".mf-accordion")];

  function apply(item, open) {
    const trigger = item.querySelector(".mf-accordion-trigger");
    const panel = item.querySelector(".mf-accordion-panel");
    item.dataset.mfOpen = String(open);
    trigger?.setAttribute("aria-expanded", String(open));
    if (panel) {
      if (open) panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    }
  }

  const handlers = items.map((item) => {
    const trigger = item.querySelector(".mf-accordion-trigger");
    const panel = item.querySelector(".mf-accordion-panel");
    const label = trigger?.id;
    if (trigger && panel) {
      panel.setAttribute("role", "region");
      if (label) panel.setAttribute("aria-labelledby", label);
      panel.id ||= `${label || "mf-accordion"}-panel`;
      trigger.setAttribute("aria-controls", panel.id);
    }
    const open = item.dataset.mfOpen === "true";
    apply(item, open);
    const onClick = () => apply(item, item.dataset.mfOpen !== "true");
    trigger?.addEventListener("click", onClick);
    return { trigger, onClick, item };
  });

  return {
    set(index, open) {
      const entry = handlers[index];
      if (entry) apply(entry.item, open);
    },
    destroy() {
      for (const { trigger, onClick } of handlers) trigger?.removeEventListener("click", onClick);
    },
  };
}
