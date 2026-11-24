import { useRef, type CSSProperties } from "react";

type StepperProps = {
  steps: string[];
  step: number;
  onChange: (step: number) => void;
  duration?: number;
  easing?: string;
};

export function Stepper({ steps, step, onChange, duration, easing }: StepperProps) {
  const root = useRef<HTMLDivElement>(null);
  const index = Math.max(0, Math.min(steps.length - 1, step));
  const style = {
    "--mf-stepper-progress": steps.length > 1 ? index / (steps.length - 1) : 0,
    ...(duration ? { "--mf-stepper-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-stepper-ease": easing } : {}),
  } as CSSProperties;

  return (
    <div ref={root} className="mf-stepper" style={style} data-mf-step={index}>
      <div className="mf-stepper-track" aria-label="Progress">
        <div className="mf-stepper-line" aria-hidden="true"><span /></div>
        {steps.map((label, position) => (
          <div className="mf-step" key={label} data-active={position === index} data-done={position < index} aria-current={position === index ? "step" : undefined}>
            <span className="mf-step-dot" aria-hidden="true"><span className="mf-step-index">{position + 1}</span></span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="mf-stepper-panels">
        {steps.map((label, position) => (
          <div className="mf-step-panel" key={label} data-active={position === index} hidden={position !== index}>
            <h3 tabIndex={-1}>{label}</h3>
            <p>Step {position + 1} of {steps.length}. The heading receives focus when the step changes.</p>
          </div>
        ))}
      </div>
      <div>
        <button className="mf-step-nav" type="button" disabled={index === 0} onClick={() => onChange(index - 1)}>Back</button>
        <button className="mf-step-nav" type="button" disabled={index === steps.length - 1} onClick={() => onChange(index + 1)}>Next</button>
      </div>
    </div>
  );
}
