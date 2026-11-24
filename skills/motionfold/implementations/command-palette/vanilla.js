// Command palette behavior for a native <dialog class="mf-command">.

export function setupCommandPalette(dialog, { onRun } = {}) {
  if (!dialog) return null;

  const input = dialog.querySelector(".mf-command-input");
  const items = [...dialog.querySelectorAll(".mf-command-item")];

  function visibleItems() {
    return items.filter((item) => !item.hidden);
  }

  function highlight(index) {
    const list = visibleItems();
    if (list.length === 0) return;
    const next = (index + list.length) % list.length;
    for (const item of items) item.setAttribute("aria-selected", String(item === list[next]));
    list[next].scrollIntoView({ block: "nearest" });
  }

  function selectedIndex() {
    const list = visibleItems();
    return Math.max(0, list.findIndex((item) => item.getAttribute("aria-selected") === "true"));
  }

  function filter() {
    const query = input ? input.value.trim().toLowerCase() : "";
    for (const item of items) {
      item.hidden = query.length > 0 && !item.textContent.toLowerCase().includes(query);
    }
    highlight(0);
  }

  function run(item) {
    if (!item) return;
    const value = item.getAttribute("data-command") ?? item.textContent.trim();
    dialog.close();
    onRun?.(value, item);
  }

  function open() {
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      if (input) input.value = "";
      filter();
      input?.focus();
    });
  }

  const onInput = () => filter();
  const onKeydown = (event) => {
    const list = visibleItems();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlight(selectedIndex() + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlight(selectedIndex() - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      highlight(0);
    } else if (event.key === "End") {
      event.preventDefault();
      highlight(list.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(list[selectedIndex()]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  };

  const onItemClick = (event) => {
    const item = event.currentTarget;
    run(item);
  };
  const onCancel = (event) => {
    event.preventDefault();
    dialog.close();
  };
  const onBackdrop = (event) => {
    if (event.target === dialog) dialog.close();
  };

  input?.addEventListener("input", onInput);
  input?.addEventListener("keydown", onKeydown);
  for (const item of items) item.addEventListener("click", onItemClick);
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("click", onBackdrop);

  return {
    open,
    close: () => dialog.close(),
    destroy() {
      input?.removeEventListener("input", onInput);
      input?.removeEventListener("keydown", onKeydown);
      for (const item of items) item.removeEventListener("click", onItemClick);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onBackdrop);
    },
  };
}
