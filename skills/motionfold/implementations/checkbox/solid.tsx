import { onMount } from "solid-js";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  duration?: number;
};

export function Checkbox(props: CheckboxProps) {
  let box!: HTMLSpanElement;
  let path!: SVGPathElement;

  onMount(() => {
    const length = Math.ceil(path.getTotalLength()) + 1;
    box.style.setProperty("--mf-checkbox-path-length", String(length));
  });

  const style = () => (props.duration ? `--mf-checkbox-draw-duration:${props.duration}ms` : "");

  return (
    <label class="mf-checkbox">
      <input type="checkbox" checked={props.checked} onChange={(event) => props.onChange(event.target.checked)} />
      <span class="mf-checkbox-box" ref={box} aria-hidden="true" style={style()}>
        <svg viewBox="0 0 16 16">
          <path ref={path} class="mf-checkbox-check" d="M3.5 8.5L6.5 11.5L12.5 4.5" />
        </svg>
      </span>
      <span class="mf-checkbox-label">
        {props.label}
        {props.description ? <span class="mf-sr-only"> — {props.description}</span> : null}
      </span>
    </label>
  );
}
