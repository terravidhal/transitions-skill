// Popover behavior on the native Popover API.
// The project owns the final positioning strategy; this helper is a compact
// viewport-aware placement that is good enough for menus anchored to a button.

export function setupPopover(trigger, panel, { gap = 8 } = {}) {
  if (!trigger || !panel) return null;

  function position() {
    const rect = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    let side = "bottom";

    if (rect.bottom + gap + height > window.innerHeight && rect.top - gap - height > 0) {
      side = "top";
    }
    if (side === "bottom" && rect.bottom + gap + height > window.innerHeight && rect.top < height) {
      side = "top";
    }

    let left = rect.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    const top = side === "top" ? rect.top - gap - height : rect.bottom + gap;
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(8, top)}px`;
    panel.dataset.mfSide = side;
  }

  function focusFirst() {
    const first = panel.querySelector('[role="menuitem"], a, button');
    first?.focus();
  }

  function open() {
    if (panel.matches(":popover-open")) return;
    panel.showPopover();
    position();
    requestAnimationFrame(position);
    focusFirst();
  }

  function close() {
    if (panel.matches(":popover-open")) panel.hidePopover();
  }

  const onClick = (event) => {
    event.preventDefault();
    if (panel.matches(":popover-open")) close();
    else open();
  };

  const onToggle = (event) => {
    trigger.setAttribute("aria-expanded", String(event.newState === "open"));
    if (event.newState === "open") {
      position();
    } else if (panel.contains(document.activeElement)) {
      trigger.focus();
    }
  };

  const onKey = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    const items = [...panel.querySelectorAll('[role="menuitem"]:not([disabled])')];
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  };

  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", onClick);
  panel.addEventListener("toggle", onToggle);
  panel.addEventListener("keydown", onKey);
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, true);

  return {
    open,
    close,
    position,
    destroy() {
      trigger.removeEventListener("click", onClick);
      panel.removeEventListener("toggle", onToggle);
      panel.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    },
  };
}
