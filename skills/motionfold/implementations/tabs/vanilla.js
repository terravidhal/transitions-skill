// Tabs behavior: selection, roving tabindex, keyboard, and the sliding pill.
// The indicator is measured without a transition on first paint and on resize.

export function setupTabs(root) {
  if (!root) return null;
  const list = root.querySelector(".mf-tabs");
  const indicator = list?.querySelector(".mf-tabs-indicator");
  const tabs = [...(list?.querySelectorAll('[role="tab"]') ?? [])];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  if (!list || !indicator || tabs.length === 0) return null;

  function panelFor(tab) {
    return panels.find((panel) => panel.id === tab.getAttribute("aria-controls"));
  }

  function move(tab, animate) {
    const listRect = list.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    if (!animate) list.dataset.mfNoAnimate = "true";
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - listRect.left}px)`;
    if (!animate) {
      void indicator.offsetWidth;
      delete list.dataset.mfNoAnimate;
    }
  }

  function select(tab, { animate = true, focus = false } = {}) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = panelFor(item);
      if (panel) panel.hidden = !selected;
    }
    move(tab, animate);
    if (focus) tab.focus();
  }

  const onClick = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tab);
  };

  const onKey = (event) => {
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) return;
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    select(tabs[next], { focus: true });
  };

  const active = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0];
  select(active, { animate: false });
  requestAnimationFrame(() => move(active, false));

  list.addEventListener("click", onClick);
  list.addEventListener("keydown", onKey);
  const observer = new ResizeObserver(() => move(active, false));
  observer.observe(list);

  return {
    select,
    destroy() {
      list.removeEventListener("click", onClick);
      list.removeEventListener("keydown", onKey);
      observer.disconnect();
    },
  };
}
