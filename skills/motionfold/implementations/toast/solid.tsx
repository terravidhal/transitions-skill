import { createEffect, onCleanup, type JSX } from "solid-js";
import { createPresence } from "../_shared/presence.solid";

type ToastProps = {
  open: () => boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  duration?: number;
  autoDismiss?: number;
  closeLabel?: string;
};

export function Toast(props: ToastProps) {
  const presence = createPresence(props.open, props.duration ?? 240);
  const delay = props.autoDismiss ?? 6000;
  let remaining = delay;
  let startedAt = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  const start = () => {
    if (delay <= 0 || !props.open()) return;
    clear();
    startedAt = Date.now();
    timer = setTimeout(props.onClose, remaining);
  };
  const pause = () => {
    if (!timer) return;
    clear();
    remaining -= Date.now() - startedAt;
  };

  createEffect(() => {
    if (props.open()) start();
    else clear();
  });
  onCleanup(() => {
    clear();
  });

  return (
    <>
      {presence.mounted() ? (
        <div
          class="mf-toast"
          data-mf-state={presence.state()}
          role="status"
          style={props.duration ? `--mf-toast-close-duration:${props.duration}ms` : ""}
          onMouseEnter={pause}
          onMouseLeave={start}
          onFocusIn={pause}
          onFocusOut={start}
        >
          <div class="mf-toast-body">
            {props.title ? <strong class="mf-toast-title">{props.title}</strong> : null}
            <span>{props.children}</span>
          </div>
          <button class="mf-toast-close" type="button" aria-label={props.closeLabel ?? "Dismiss"} onClick={props.onClose}>
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
