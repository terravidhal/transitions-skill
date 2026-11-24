import { createSignal, For, onCleanup, onMount } from "solid-js";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  duration?: number;
};

export function Dropdown(props: DropdownProps) {
  let root!: HTMLDivElement;
  let trigger!: HTMLButtonElement;
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(Math.max(0, props.options.findIndex((option) => option.value === props.value)));

  onMount(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (open() && !root.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    onCleanup(() => document.removeEventListener("pointerdown", onPointerDown));
  });

  const current = () => props.options.find((option) => option.value === props.value);

  function choose(index: number) {
    const option = props.options[index];
    if (!option) return;
    props.onChange(option.value);
    setOpen(false);
    trigger?.focus();
  }

  return (
    <div ref={root} class="mf-dropdown" data-mf-state={open() ? "open" : "closed"} style={props.duration ? { "--mf-dropdown-duration": props.duration + "ms" } : undefined}>
      <button ref={trigger} class="mf-dropdown-trigger" type="button" aria-haspopup="listbox" aria-expanded={open()} onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => { if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); setOpen(true); } }}>
        <span class="mf-dropdown-value">{current()?.label ?? props.label}</span>
        <span class="mf-dropdown-chevron" aria-hidden="true">⌄</span>
      </button>
      <ul class="mf-dropdown-list" role="listbox" aria-label={props.label}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => (value + 1) % props.options.length); }
          else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => (value - 1 + props.options.length) % props.options.length); }
          else if (event.key === "Enter") { event.preventDefault(); choose(active()); }
          else if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger?.focus(); }
        }}>
        <For each={props.options}>
          {(option, index) => (
            <li class="mf-dropdown-item" role="option" tabIndex={-1} aria-selected={option.value === props.value} onClick={() => choose(index())}>{option.label}</li>
          )}
        </For>
      </ul>
    </div>
  );
}
