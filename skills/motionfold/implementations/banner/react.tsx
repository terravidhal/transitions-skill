import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type BannerProps = {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  duration?: number;
};

export function Banner({ open, onDismiss, children, duration }: BannerProps) {
  const [state, setState] = useState(open ? "open" : "closed");
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setState("open");
      return;
    }
    if (!mounted) return;
    setState("closing");
    const timer = setTimeout(() => {
      setMounted(false);
      setState("closed");
    }, (duration ?? 200) + 60);
    return () => clearTimeout(timer);
  }, [open, duration]);

  if (!mounted) return null;
  const style = duration ? ({ "--mf-banner-close-duration": duration + "ms" } as CSSProperties) : undefined;

  return (
    <div className="mf-banner" data-mf-state={state} style={style} role="status">
      <span className="mf-banner-icon" aria-hidden="true">◆</span>
      <p className="mf-banner-text">{children}</p>
      <button className="mf-banner-close" type="button" aria-label="Dismiss" onClick={onDismiss}>×</button>
    </div>
  );
}
