// Drawer behavior for a native <dialog class="mf-drawer">.
// Same guarantees as the modal: focus trap, Escape, top layer, focus return.

export function setupDrawer(dialog, { onOpenChange } = {}) {
  if (!dialog) return null;

  const open = () => {
    if (!dialog.open) dialog.showModal();
    onOpenChange?.(true);
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const onCancel = (event) => {
    event.preventDefault();
    close();
  };
  const onClose = () => onOpenChange?.(false);
  const onBackdrop = (event) => {
    if (event.target === dialog) close();
  };

  const closeButtons = [...dialog.querySelectorAll("[data-mf-close]")];
  for (const button of closeButtons) button.addEventListener("click", close);
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("close", onClose);
  dialog.addEventListener("click", onBackdrop);

  return {
    open,
    close,
    destroy() {
      for (const button of closeButtons) button.removeEventListener("click", close);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onBackdrop);
    },
  };
}
