import type { CSSProperties } from "react";

type SpinnerCheckProps = {
  state: "loading" | "done";
  label?: string;
  doneLabel?: string;
  duration?: number;
  easing?: string;
};

export function SpinnerCheck({ state, label = "Working", doneLabel = "Done", duration, easing }: SpinnerCheckProps) {
  const style = {
    ...(duration ? { "--mf-spinner-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-spinner-ease": easing } : {}),
  } as CSSProperties;

  return (
    <span className="mf-spinner" data-mf-state={state} aria-busy={state === "loading"} style={style} role="status">
      <span className="mf-spinner-ring" aria-hidden="true" />
      <span className="mf-spinner-check" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="mf-spinner-label mf-sr-only">{state === "done" ? doneLabel : label}</span>
    </span>
  );
}
