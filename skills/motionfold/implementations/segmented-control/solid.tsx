import { For } from "solid-js";

type SegmentOption = { value: string; label: string };

type SegmentedControlProps = {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  duration?: number;
  easing?: string;
};

export function SegmentedControl(props: SegmentedControlProps) {
  let root!: HTMLDivElement;
  const index = () => Math.max(0, props.options.findIndex((option) => option.value === props.value));

  function move(next: number, event: KeyboardEvent) {
    const option = props.options[(next + props.options.length) % props.options.length];
    if (!option) return;
    event.preventDefault();
    props.onChange(option.value);
    const buttons = root.querySelectorAll<HTMLButtonElement>(".mf-segmented-item");
    buttons[(next + props.options.length) % props.options.length]?.focus();
  }

  return (
    <div
      ref={root}
      class="mf-segmented"
      role="group"
      aria-label={props.label}
      style={{
        "--mf-seg-count": props.options.length,
        "--mf-seg-index": index(),
        ...(props.duration ? { "--mf-seg-duration": props.duration + "ms" } : {}),
        ...(props.easing ? { "--mf-seg-ease": props.easing } : {}),
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") move(index() + 1, event);
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") move(index() - 1, event);
      }}
    >
      <span class="mf-segmented-indicator" aria-hidden="true" />
      <For each={props.options}>
        {(option) => (
          <button class="mf-segmented-item" type="button" aria-pressed={option.value === props.value} onClick={() => props.onChange(option.value)}>
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
