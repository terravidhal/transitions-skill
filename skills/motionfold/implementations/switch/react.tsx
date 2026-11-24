import type { CSSProperties } from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  duration?: number;
  easing?: string;
  travel?: number;
};

export function Switch({ checked, onChange, label, duration, easing, travel }: SwitchProps) {
  const style = {
    ...(duration ? { "--mf-switch-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-switch-ease": easing } : {}),
    ...(travel ? { "--mf-switch-travel": `${travel}px` } : {}),
  } as CSSProperties;

  return (
    <button
      className="mf-switch"
      type="button"
      role="switch"
      aria-checked={checked}
      style={style}
      onClick={() => onChange(!checked)}
    >
      <span className="mf-switch-track" aria-hidden="true">
        <span className="mf-switch-thumb" />
      </span>
      <span>{label}</span>
    </button>
  );
}
