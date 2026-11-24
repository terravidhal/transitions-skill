// Segmented control behavior. One indicator, one CSS variable, no measuring.

export function setupSegmented(root, { onChange } = {}) {
  if (!root) return null;
  const items = [...root.querySelectorAll(".mf-segmented-item")];
  let index = Math.max(0, items.findIndex((item) => item.getAttribute("aria-pressed") === "true"));

  root.style.setProperty("--mf-seg-count", String(items.length));

  function select(next, focus = false) {
    index = (next + items.length) % items.length;
    root.style.setProperty("--mf-seg-index", String(index));
    items.forEach((item, position) => item.setAttribute("aria-pressed", String(position === index)));
    if (focus) items[index]?.focus();
    onChange?.(items[index], index);
  }

  const onClick = (event) => {
    const position = items.indexOf(event.currentTarget);
    if (position >= 0) select(position);
  };
  const onKeydown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(items.length - 1, true);
    }
  };

  for (const item of items) item.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeydown);
  select(index);

  return {
    select,
    destroy() {
      for (const item of items) item.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeydown);
    },
  };
}
