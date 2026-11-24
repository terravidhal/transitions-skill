// Bottom sheet behavior for a native <dialog class="mf-sheet">.
// The CSS animates entry and exit; the browser owns focus, Escape, and the top layer.

export function setupSheet(dialog) {
  if (!dialog) return null;

  const open = () => {
    if (!dialog.open) dialog.showModal();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const onCancel = (event) => {
    event.preventDefault();
    close();
  };

  const onBackdrop = (event) => {
    if (event.target === dialog) close();
  };

  const closeButtons = [...dialog.querySelectorAll("[data-mf-close]")];
  for (const button of closeButtons) button.addEventListener("click", close);
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("click", onBackdrop);

  return {
    open,
    close,
    destroy() {
      for (const button of closeButtons) button.removeEventListener("click", close);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onBackdrop);
    },
  };
}
