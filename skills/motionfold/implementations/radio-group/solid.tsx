import { For } from "solid-js";

type RadioOption = { value: string; label: string };

type RadioGroupProps = {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  duration?: number;
  easing?: string;
};

export function RadioGroup(props: RadioGroupProps) {
  return (
    <fieldset
      class="mf-radio-group"
      style={{
        ...(props.duration ? { "--mf-radio-duration": props.duration + "ms" } : {}),
        ...(props.easing ? { "--mf-radio-ease": props.easing } : {}),
      }}
    >
      <legend class="mf-radio-legend">{props.legend}</legend>
      <For each={props.options}>
        {(option) => (
          <label class="mf-radio">
            <input type="radio" name={props.name} value={option.value} checked={option.value === props.value} onChange={() => props.onChange(option.value)} />
            <span class="mf-radio-box" aria-hidden="true"><span class="mf-radio-dot" /></span>
            <span>{option.label}</span>
          </label>
        )}
      </For>
    </fieldset>
  );
}
