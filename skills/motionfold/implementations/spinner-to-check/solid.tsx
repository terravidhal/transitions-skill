type SpinnerCheckProps = {
  state: "loading" | "done";
  label?: string;
  doneLabel?: string;
  duration?: number;
  easing?: string;
};

export function SpinnerCheck(props: SpinnerCheckProps) {
  return (
    <span class="mf-spinner" data-mf-state={props.state} aria-busy={props.state === "loading"} role="status" style={{
      ...(props.duration ? { "--mf-spinner-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-spinner-ease": props.easing } : {}),
    }}>
      <span class="mf-spinner-ring" aria-hidden="true" />
      <span class="mf-spinner-check" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="mf-spinner-label mf-sr-only">{props.state === "done" ? (props.doneLabel ?? "Done") : (props.label ?? "Working")}</span>
    </span>
  );
}
