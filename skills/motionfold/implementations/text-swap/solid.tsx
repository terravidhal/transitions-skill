import { createEffect, type Accessor } from "solid-js";

type TextSwapProps = {
  value: Accessor<string>;
  duration?: number;
};

export function TextSwap(props: TextSwapProps) {
  let root!: HTMLSpanElement;
  let current!: HTMLSpanElement;
  let ghost!: HTMLSpanElement;
  let previous = props.value();
  let timer: ReturnType<typeof setTimeout> | undefined;

  createEffect(() => {
    const next = props.value();
    if (!root || !current || !ghost || previous === next) return;
    ghost.textContent = previous;
    root.dataset.mfSwapping = "false";
    void root.offsetWidth;
    current.textContent = next;
    root.dataset.mfSwapping = "true";
    previous = next;
    clearTimeout(timer);
    timer = setTimeout(() => {
      root.dataset.mfSwapping = "false";
      ghost.textContent = "";
    }, 220);
  });

  const style = () => (props.duration ? `--mf-text-swap-duration:${props.duration}ms` : "");

  return (
    <span class="mf-text-swap" ref={root} data-mf-swapping="false" aria-live="polite" style={style()}>
      <span class="mf-text-swap-value" ref={current}>
        {props.value()}
      </span>
      <span class="mf-text-swap-ghost" ref={ghost} aria-hidden="true" />
    </span>
  );
}
