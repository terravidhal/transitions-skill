// Lightbox behavior for a native <dialog class="mf-lightbox">.

export function setupLightbox(dialog) {
  if (!dialog) return null;

  const open = () => {
    if (!dialog.open) dialog.showModal();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const closeButtons = [...dialog.querySelectorAll("[data-mf-close]")];
  for (const button of closeButtons) button.addEventListener("click", close);
  const onCancel = (event) => {
    event.preventDefault();
    close();
  };
  const onBackdrop = (event) => {
    if (event.target === dialog) close();
  };

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
