import { createEffect, onMount, type Accessor } from "solid-js";

type SuccessCheckProps = {
  show: Accessor<boolean>;
  label?: string;
  duration?: number;
};

export function SuccessCheck(props: SuccessCheckProps) {
  let root!: HTMLSpanElement;
  let icon!: SVGSVGElement;
  let path!: SVGPathElement;
  let was = false;

  onMount(() => {
    const length = Math.ceil(path.getTotalLength()) + 1;
    icon.style.setProperty("--mf-check-path-length", String(length));
  });

  createEffect(() => {
    const visible = props.show();
    if (!root) return;
    if (visible && !was) {
      root.dataset.mfState = "idle";
      void root.offsetWidth;
      root.dataset.mfState = "success";
    } else if (!visible) {
      root.dataset.mfState = "idle";
    }
    was = visible;
  });

  const style = () => (props.duration ? `--mf-check-duration:${props.duration}ms` : "");

  return (
    <span class="mf-success" ref={root} data-mf-state={props.show() ? "success" : "idle"} role="status" style={style()}>
      <svg class="mf-success-icon" ref={icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35" />
        <path class="mf-success-path" ref={path} d="M7 12.5L10.5 16L17 8" />
      </svg>
      <span class="mf-success-text">{props.label ?? "Saved"}</span>
    </span>
  );
}
