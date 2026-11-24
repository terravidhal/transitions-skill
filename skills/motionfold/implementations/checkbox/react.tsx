import { useEffect, useRef, type CSSProperties } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  duration?: number;
};

export function Checkbox({ checked, onChange, label, description, duration }: CheckboxProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const box = boxRef.current;
    if (!path || !box) return;
    const measure = () => {
      const length = Math.ceil(path.getTotalLength()) + 1;
      box.style.setProperty("--mf-checkbox-path-length", String(length));
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
  }, []);

  const style = {
    ...(duration ? { "--mf-checkbox-draw-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <label className="mf-checkbox">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="mf-checkbox-box" ref={boxRef} aria-hidden="true" style={style}>
        <svg viewBox="0 0 16 16">
          <path ref={pathRef} className="mf-checkbox-check" d="M3.5 8.5L6.5 11.5L12.5 4.5" />
        </svg>
      </span>
      <span className="mf-checkbox-label">
        {label}
        {description ? <span className="mf-sr-only"> — {description}</span> : null}
      </span>
    </label>
  );
}
