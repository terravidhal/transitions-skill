import { useEffect, useRef, useState } from "react";

export function motionAllowed(root = document.documentElement) {
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Keeps a disappearing surface mounted until its exit finishes.
 * duration is in milliseconds and should match the recipe token.
 */
export function usePresence(open, duration = 240) {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState(open ? "open" : "closed");
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (open) {
      setMounted(true);
      setState("open");
      return;
    }
    if (!mounted) {
      setState("closed");
      return;
    }
    if (!motionAllowed()) {
      setMounted(false);
      setState("closed");
      return;
    }
    setState("closing");
    timer.current = setTimeout(() => {
      setMounted(false);
      setState("closed");
    }, duration + 60);
    return () => clearTimeout(timer.current);
  }, [open, duration]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { mounted, state };
}
