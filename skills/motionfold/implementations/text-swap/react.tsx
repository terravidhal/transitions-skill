import { useEffect, useRef, type CSSProperties } from "react";

type TextSwapProps = {
  value: string;
  duration?: number;
};

export function TextSwap({ value, duration }: TextSwapProps) {
  const root = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = root.current;
    const current = valueRef.current;
    const ghost = ghostRef.current;
    if (!element || !current || !ghost) return;
    if (previous.current === value) return;

    ghost.textContent = previous.current;
    element.dataset.mfSwapping = "false";
    void element.offsetWidth;
    current.textContent = value;
    element.dataset.mfSwapping = "true";
    previous.current = value;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      element.dataset.mfSwapping = "false";
      ghost.textContent = "";
    }, 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  const style = {
    ...(duration ? { "--mf-text-swap-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <span className="mf-text-swap" ref={root} data-mf-swapping="false" aria-live="polite" style={style}>
      <span className="mf-text-swap-value" ref={valueRef}>
        {value}
      </span>
      <span className="mf-text-swap-ghost" ref={ghostRef} aria-hidden="true" />
    </span>
  );
}
