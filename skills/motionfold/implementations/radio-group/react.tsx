import type { CSSProperties } from "react";

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

export function RadioGroup({ name, legend, options, value, onChange, duration, easing }: RadioGroupProps) {
  const style = {
    ...(duration ? { "--mf-radio-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-radio-ease": easing } : {}),
  } as CSSProperties;

  return (
    <fieldset className="mf-radio-group" style={style}>
      <legend className="mf-radio-legend">{legend}</legend>
      {options.map((option) => (
        <label className="mf-radio" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span className="mf-radio-box" aria-hidden="true"><span className="mf-radio-dot" /></span>
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
