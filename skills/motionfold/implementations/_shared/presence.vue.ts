import { onBeforeUnmount, ref, watch, type Ref } from "vue";

export function motionAllowed(root = document.documentElement) {
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Keeps a disappearing surface mounted until its exit finishes.
 * Usage: const { mounted, state } = usePresence(open, 240);
 */
export function usePresence(open: Ref<boolean>, duration = 240) {
  const mounted = ref(open.value);
  const state = ref(open.value ? "open" : "closed");
  let timer: ReturnType<typeof setTimeout> | undefined;

  watch(
    open,
    (value) => {
      clearTimeout(timer);
      if (value) {
        mounted.value = true;
        state.value = "open";
        return;
      }
      if (!mounted.value) {
        state.value = "closed";
        return;
      }
      if (!motionAllowed()) {
        mounted.value = false;
        state.value = "closed";
        return;
      }
      state.value = "closing";
      timer = setTimeout(() => {
        mounted.value = false;
        state.value = "closed";
      }, duration + 60);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => clearTimeout(timer));
  return { mounted, state };
}
