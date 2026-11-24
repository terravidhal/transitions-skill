// Theme reveal helper. The theme change is the source of truth; the reveal is optional.
import { motionAllowed } from "../_shared/presence.vanilla.js";

export function revealTheme(button, apply) {
  if (typeof apply !== "function") return;
  const root = document.documentElement;

  if (!document.startViewTransition || !motionAllowed(root)) {
    apply();
    return;
  }

  const rect = button?.getBoundingClientRect?.();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  root.style.setProperty("--mf-theme-x", x + "px");
  root.style.setProperty("--mf-theme-y", y + "px");
  root.style.setProperty("--mf-theme-radius", radius + "px");

  const transition = document.startViewTransition(() => {
    apply();
  });
  return transition.finished;
}
