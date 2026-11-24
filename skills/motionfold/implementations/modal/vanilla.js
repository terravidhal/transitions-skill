// Modal behavior for a native <dialog class="mf-modal">.
// The CSS handles entry and exit; the browser handles focus, Escape, and top layer.

export function setupModal(dialog, { onOpenChange } = {}) {
  if (!dialog) return null;

  const open = () => {
    if (!dialog.open) dialog.showModal();
    onOpenChange?.(true);
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const onCancel = (event) => {
    // Let the exit transition run instead of letting the UA hide instantly.
    event.preventDefault();
    close();
  };

  const onClose = () => onOpenChange?.(false);
  const onBackdrop = (event) => {
    if (event.target === dialog) close();
  };
  const onKey = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const closeButtons = [...dialog.querySelectorAll("[data-mf-close]")];
  for (const button of closeButtons) button.addEventListener("click", close);
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("close", onClose);
  dialog.addEventListener("click", onBackdrop);
  dialog.addEventListener("keydown", onKey);

  return {
    open,
    close,
    destroy() {
      for (const button of closeButtons) button.removeEventListener("click", close);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onBackdrop);
      dialog.removeEventListener("keydown", onKey);
    },
  };
}
