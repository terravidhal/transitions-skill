import { For } from "solid-js";

type StepperProps = {
  steps: string[];
  step: number;
  onChange: (step: number) => void;
  duration?: number;
  easing?: string;
};

export function Stepper(props: StepperProps) {
  const index = () => Math.max(0, Math.min(props.steps.length - 1, props.step));

  return (
    <div class="mf-stepper" data-mf-step={index()} style={{
      "--mf-stepper-progress": props.steps.length > 1 ? index() / (props.steps.length - 1) : 0,
      ...(props.duration ? { "--mf-stepper-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-stepper-ease": props.easing } : {}),
    }}>
      <div class="mf-stepper-track" aria-label="Progress">
        <div class="mf-stepper-line" aria-hidden="true"><span /></div>
        <For each={props.steps}>
          {(label, position) => (
            <div class="mf-step" data-active={position() === index()} data-done={position() < index()} aria-current={position() === index() ? "step" : undefined}>
              <span class="mf-step-dot" aria-hidden="true"><span class="mf-step-index">{position() + 1}</span></span>
              <span>{label}</span>
            </div>
          )}
        </For>
      </div>
      <div class="mf-stepper-panels">
        <For each={props.steps}>
          {(label, position) => (
            <div class="mf-step-panel" data-active={position() === index()} hidden={position() !== index()}>
              <h3 tabIndex={-1}>{label}</h3>
              <p>Step {position() + 1} of {props.steps.length}. The heading receives focus when the step changes.</p>
            </div>
          )}
        </For>
      </div>
      <div>
        <button class="mf-step-nav" type="button" disabled={index() === 0} onClick={() => props.onChange(index() - 1)}>Back</button>
        <button class="mf-step-nav" type="button" disabled={index() === props.steps.length - 1} onClick={() => props.onChange(index() + 1)}>Next</button>
      </div>
    </div>
  );
}
