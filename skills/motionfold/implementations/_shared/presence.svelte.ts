import { writable, type Readable } from "svelte/store";

export function motionAllowed(root = globalThis.document?.documentElement) {
  if (!root) return true;
  const preference = root.dataset.motion;
  if (preference === "full") return true;
  if (preference === "reduced") return false;
  return !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type PresenceState = "open" | "closing" | "closed";

/**
 * Keeps a disappearing surface mounted until its exit finishes.
 * subscribe(({ mounted, state }) => ...)
 */
export function createPresence(open, duration = 240) {
  let timer;
  const store = writable({ mounted: open, state: open ? "open" : "closed" });
  const { subscribe } = store;

  function set(next) {
    clearTimeout(timer);
    if (next) {
      store.set({ mounted: true, state: "open" });
      return;
    }
    if (!motionAllowed()) {
      store.set({ mounted: false, state: "closed" });
      return;
    }
    store.update((current) => {
      if (!current.mounted) return { mounted: false, state: "closed" };
      return { mounted: true, state: "closing" };
    });
    timer = setTimeout(() => store.set({ mounted: false, state: "closed" }), duration + 60);
  }

  set(open);

  return {
    subscribe,
    set,
    destroy() {
      clearTimeout(timer);
    },
  } satisfies Readable<{ mounted: boolean; state: PresenceState }> & {
    set: (open: boolean) => void;
    destroy: () => void;
  };
}
