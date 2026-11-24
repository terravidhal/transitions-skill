// Banner behavior. The presence helper keeps the message mounted during exit.
import { createPresence } from "../_shared/presence.vanilla.js";

export function setupBanner(element, { onDismiss } = {}) {
  if (!element) return null;

  const presence = createPresence(element, {
    closeToken: "--mf-banner-close-duration",
    fallback: 200,
  });

  const dismiss = element.querySelector("[data-mf-dismiss]");
  const onClose = () => {
    presence.close();
    onDismiss?.();
  };

  dismiss?.addEventListener("click", onClose);

  return {
    open: () => presence.open(),
    close: onClose,
    destroy() {
      dismiss?.removeEventListener("click", onClose);
      presence.destroy();
    },
  };
}
