import { createEffect, createSignal, onCleanup } from "solid-js";

export function motionAllowed(root = document.documentElement) {
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Keeps a disappearing surface mounted until its exit finishes.
 * Usage: const presence = createPresence(() => open(), 240);
 */
export function createPresence(open, duration = 240) {
  const [mounted, setMounted] = createSignal(open());
  const [state, setState] = createSignal(open() ? "open" : "closed");
  let timer;

  createEffect(() => {
    const value = open();
    clearTimeout(timer);
    if (value) {
      setMounted(true);
      setState("open");
      return;
    }
    if (!mounted()) {
      setState("closed");
      return;
    }
    if (!motionAllowed()) {
      setMounted(false);
      setState("closed");
      return;
    }
    setState("closing");
    timer = setTimeout(() => {
      setMounted(false);
      setState("closed");
    }, duration + 60);
  });

  onCleanup(() => clearTimeout(timer));
  return { mounted, state };
}
