import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

type SuccessCheckProps = {
  show: boolean;
  label?: string;
  duration?: number;
};

export function SuccessCheck({ show, label = "Saved", duration }: SuccessCheckProps) {
  const iconRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = Math.ceil(path.getTotalLength()) + 1;
    iconRef.current?.style.setProperty("--mf-check-path-length", String(length));
  }, []);

  useEffect(() => {
    if (!show || !rootRef.current) return;
    const element = rootRef.current;
    element.dataset.mfState = "idle";
    void element.offsetWidth;
    element.dataset.mfState = "success";
  }, [show]);

  const style = {
    ...(duration ? { "--mf-check-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <span className="mf-success" ref={rootRef} data-mf-state={show ? "success" : "idle"} role="status" style={style}>
      <svg className="mf-success-icon" ref={iconRef} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
        <path className="mf-success-path" ref={pathRef} d="M7 12.5L10.5 16L17 8" />
      </svg>
      <span className="mf-success-text">{label}</span>
    </span>
  );
}
