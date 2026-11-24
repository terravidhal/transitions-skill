import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePresence } from "../_shared/presence.react";

type ToastProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  duration?: number;
  autoDismiss?: number;
  closeLabel?: string;
};

export function Toast({
  open,
  onClose,
  title,
  children,
  duration,
  autoDismiss = 6000,
  closeLabel = "Dismiss",
}: ToastProps) {
  const { mounted, state } = usePresence(open, duration ?? 240);
  const remaining = useRef(autoDismiss);
  const startedAt = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const start = () => {
    if (autoDismiss <= 0) return;
    clear();
    startedAt.current = Date.now();
    timer.current = setTimeout(onClose, remaining.current);
  };

  const pause = () => {
    if (!timer.current) return;
    clear();
    remaining.current -= Date.now() - startedAt.current;
  };

  useEffect(() => {
    if (open) start();
    else clear();
    return clear;
  }, [open]);

  if (!mounted) return null;

  const style = {
    ...(duration ? { "--mf-toast-close-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <div
      className="mf-toast"
      data-mf-state={state}
      role="status"
      style={style}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
    >
      <div className="mf-toast-body">
        {title ? <strong className="mf-toast-title">{title}</strong> : null}
        <span>{children}</span>
      </div>
      <button className="mf-toast-close" type="button" aria-label={closeLabel} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
