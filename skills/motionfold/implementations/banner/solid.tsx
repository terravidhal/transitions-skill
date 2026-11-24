import { createEffect, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";

type BannerProps = {
  open: boolean;
  onDismiss: () => void;
  duration?: number;
  children: JSX.Element;
};

export function Banner(props: BannerProps) {
  const [mounted, setMounted] = createSignal(props.open);
  const [state, setState] = createSignal(props.open ? "open" : "closed");
  let timer: ReturnType<typeof setTimeout> | undefined;

  createEffect(() => {
    clearTimeout(timer);
    if (props.open) {
      setMounted(true);
      setState("open");
      return;
    }
    if (!mounted()) return;
    setState("closing");
    timer = setTimeout(() => {
      setMounted(false);
      setState("closed");
    }, (props.duration ?? 200) + 60);
  });

  return (
    <Show when={mounted()}>
      <div class="mf-banner" data-mf-state={state()} style={props.duration ? { "--mf-banner-close-duration": props.duration + "ms" } : undefined} role="status">
        <span class="mf-banner-icon" aria-hidden="true">◆</span>
        <p class="mf-banner-text">{props.children}</p>
        <button class="mf-banner-close" type="button" aria-label="Dismiss" onClick={props.onDismiss}>×</button>
      </div>
    </Show>
  );
}
