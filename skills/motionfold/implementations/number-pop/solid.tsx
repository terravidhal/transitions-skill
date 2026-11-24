import { createEffect, createSignal } from "solid-js";

type NumberPopProps = {
  value: number;
  duration?: number;
  easing?: string;
};

export function NumberPop(props: NumberPopProps) {
  const [bump, setBump] = createSignal(false);
  let first = true;

  createEffect(() => {
    props.value;
    if (first) {
      first = false;
      return;
    }
    setBump(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setBump(true)));
  });

  return (
    <output class="mf-number" data-mf-bump={bump()} aria-live="polite" style={{
      ...(props.duration ? { "--mf-number-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-number-ease": props.easing } : {}),
    }}>
      <span class="mf-number-value">{props.value}</span>
    </output>
  );
}
