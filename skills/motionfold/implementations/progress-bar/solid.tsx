type ProgressBarProps = {
  value: number;
  label?: string;
  duration?: number;
  easing?: string;
};

export function ProgressBar(props: ProgressBarProps) {
  const clamped = () => Math.max(0, Math.min(100, props.value));

  return (
    <div class="mf-progress-row" style={{
      ...(props.duration ? { "--mf-progress-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-progress-ease": props.easing } : {}),
    }}>
      <div class="mf-progress-label"><span>{props.label ?? "Upload"}</span><span class="mf-progress-value">{Math.round(clamped())}%</span></div>
      <div class="mf-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamped())} aria-label={props.label ?? "Upload"} style={{ "--mf-progress": clamped() }}>
        <div class="mf-progress-fill" />
      </div>
    </div>
  );
}
