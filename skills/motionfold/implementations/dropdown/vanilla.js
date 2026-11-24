// Dropdown behavior. The root carries data-mf-state; the trigger owns aria-expanded.
import { createPresence } from "../_shared/presence.vanilla.js";

export function setupDropdown(root, { onSelect } = {}) {
  if (!root) return null;

  const trigger = root.querySelector(".mf-dropdown-trigger");
  const value = root.querySelector(".mf-dropdown-value");
  const items = [...root.querySelectorAll(".mf-dropdown-item")];
  const presence = createPresence(root, { closeToken: "--mf-dropdown-close-duration", fallback: 160 });

  function selectedIndex() {
    return Math.max(0, items.findIndex((item) => item.getAttribute("aria-selected") === "true"));
  }

  function highlight(index) {
    const next = (index + items.length) % items.length;
    for (const item of items) item.setAttribute("aria-selected", String(item === items[next]));
    items[next].scrollIntoView({ block: "nearest" });
  }

  function open() {
    presence.open();
    trigger?.setAttribute("aria-expanded", "true");
    highlight(selectedIndex());
    items[selectedIndex()]?.focus();
  }

  function close({ focus = false } = {}) {
    presence.close();
    trigger?.setAttribute("aria-expanded", "false");
    if (focus) trigger?.focus();
  }

  function select(item) {
    for (const option of items) option.setAttribute("aria-selected", String(option === item));
    if (value) value.textContent = item.textContent.trim();
    onSelect?.(item.getAttribute("data-value") ?? item.textContent.trim(), item);
    close({ focus: true });
  }

  const onTriggerClick = () => {
    if (root.getAttribute("data-mf-state") === "open") close();
    else open();
  };
  const onTriggerKeydown = (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      open();
    }
  };
  const onListKeydown = (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); highlight(selectedIndex() + 1); items[selectedIndex()]?.focus(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); highlight(selectedIndex() - 1); items[selectedIndex()]?.focus(); }
    else if (event.key === "Home") { event.preventDefault(); highlight(0); items[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); highlight(items.length - 1); items[items.length - 1]?.focus(); }
    else if (event.key === "Escape") { event.preventDefault(); close({ focus: true }); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); const item = document.activeElement; if (items.includes(item)) select(item); }
  };
  const onItemClick = (event) => select(event.currentTarget);
  const onPointerDown = (event) => {
    if (!root.contains(event.target)) close();
  };

  trigger?.addEventListener("click", onTriggerClick);
  trigger?.addEventListener("keydown", onTriggerKeydown);
  root.addEventListener("keydown", onListKeydown);
  for (const item of items) {
    item.tabIndex = -1;
    item.addEventListener("click", onItemClick);
  }
  document.addEventListener("pointerdown", onPointerDown);

  return {
    open,
    close,
    destroy() {
      trigger?.removeEventListener("click", onTriggerClick);
      trigger?.removeEventListener("keydown", onTriggerKeydown);
      root.removeEventListener("keydown", onListKeydown);
      for (const item of items) item.removeEventListener("click", onItemClick);
      document.removeEventListener("pointerdown", onPointerDown);
      presence.destroy();
    },
  };
}
