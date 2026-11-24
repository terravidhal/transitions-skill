type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  duration?: number;
  easing?: string;
  travel?: number;
};

export function Switch(props: SwitchProps) {
  const style = () =>
    [
      props.duration ? `--mf-switch-duration:${props.duration}ms` : "",
      props.easing ? `--mf-switch-ease:${props.easing}` : "",
      props.travel ? `--mf-switch-travel:${props.travel}px` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <button
      class="mf-switch"
      type="button"
      role="switch"
      aria-checked={props.checked}
      style={style()}
      onClick={() => props.onChange(!props.checked)}
    >
      <span class="mf-switch-track" aria-hidden="true">
        <span class="mf-switch-thumb" />
      </span>
      <span>{props.label}</span>
    </button>
  );
}
