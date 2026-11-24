// Inline edit behavior. Enter saves, Escape cancels, blur saves.

export function setupInlineEdit(root, { value, onSave } = {}) {
  if (!root) return null;
  const view = root.querySelector(".mf-inline-edit-view");
  const label = root.querySelector(".mf-inline-edit-label");
  const form = root.querySelector(".mf-inline-edit-form");
  const input = root.querySelector(".mf-inline-edit-input");
  let current = value ?? label?.textContent ?? "";
  let cancelled = false;

  function render() {
    if (label) label.textContent = current;
    if (input) input.value = current;
    root.setAttribute("data-mf-editing", "false");
  }

  function edit() {
    cancelled = false;
    root.setAttribute("data-mf-editing", "true");
    if (input) {
      input.value = current;
      input.focus();
      input.select();
    }
  }

  function save() {
    if (cancelled) return;
    const next = input?.value.trim();
    if (next) current = next;
    render();
    view?.focus();
    onSave?.(current);
  }

  function cancel() {
    cancelled = true;
    render();
    view?.focus();
  }

  const onViewClick = () => edit();
  const onViewKeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      edit();
    }
  };
  const onInputKeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };
  const onBlur = () => {
    if (root.getAttribute("data-mf-editing") === "true") save();
  };

  view?.addEventListener("click", onViewClick);
  view?.addEventListener("keydown", onViewKeydown);
  input?.addEventListener("keydown", onInputKeydown);
  input?.addEventListener("blur", onBlur);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    save();
  });
  render();

  return {
    edit,
    save,
    cancel,
    destroy() {
      view?.removeEventListener("click", onViewClick);
      view?.removeEventListener("keydown", onViewKeydown);
      input?.removeEventListener("keydown", onInputKeydown);
      input?.removeEventListener("blur", onBlur);
    },
  };
}
