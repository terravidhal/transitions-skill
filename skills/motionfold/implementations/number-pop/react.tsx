import { useEffect, useRef, useState, type CSSProperties } from "react";

type NumberPopProps = {
  value: number;
  duration?: number;
  easing?: string;
};

export function NumberPop({ value, duration, easing }: NumberPopProps) {
  const [bump, setBump] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBump(false);
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setBump(true)));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const style = {
    ...(duration ? { "--mf-number-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-number-ease": easing } : {}),
  } as CSSProperties;

  return (
    <output className="mf-number" data-mf-bump={bump} aria-live="polite" style={style}>
      <span className="mf-number-value">{value}</span>
    </output>
  );
}
