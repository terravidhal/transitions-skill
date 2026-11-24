import type { CSSProperties } from "react";

type ProgressBarProps = {
  value: number;
  label?: string;
  duration?: number;
  easing?: string;
};

export function ProgressBar({ value, label = "Upload", duration, easing }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const style = {
    ...(duration ? { "--mf-progress-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-progress-ease": easing } : {}),
  } as CSSProperties;

  return (
    <div className="mf-progress-row" style={style}>
      <div className="mf-progress-label">
        <span>{label}</span>
        <span className="mf-progress-value">{Math.round(clamped)}%</span>
      </div>
      <div className="mf-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamped)} aria-label={label} style={{ "--mf-progress": clamped } as CSSProperties}>
        <div className="mf-progress-fill" />
      </div>
    </div>
  );
}
