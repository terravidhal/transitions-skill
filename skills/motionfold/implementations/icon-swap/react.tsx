import type { CSSProperties } from "react";

type IconSwapProps = {
  active: boolean;
  onToggle: () => void;
  label: string;
  duration?: number;
  easing?: string;
};

export function IconSwap({ active, onToggle, label, duration, easing }: IconSwapProps) {
  const style = {
    ...(duration ? { "--mf-icon-swap-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-icon-swap-ease": easing } : {}),
  } as CSSProperties;

  return (
    <button
      className="mf-icon-swap"
      type="button"
      aria-pressed={active}
      aria-label={label}
      data-mf-active={active}
      style={style}
      onClick={onToggle}
    >
      <span className="mf-icon-swap-layer" data-icon="off" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="10.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="2.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="10.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>
      </span>
      <span className="mf-icon-swap-layer" data-icon="on" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </span>
    </button>
  );
}
