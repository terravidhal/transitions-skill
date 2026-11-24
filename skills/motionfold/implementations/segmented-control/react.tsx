import { useRef, type CSSProperties } from "react";

type SegmentOption = { value: string; label: string };

type SegmentedControlProps = {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  duration?: number;
  easing?: string;
};

export function SegmentedControl({ label, options, value, onChange, duration, easing }: SegmentedControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  const style = {
    "--mf-seg-count": options.length,
    "--mf-seg-index": index,
    ...(duration ? { "--mf-seg-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-seg-ease": easing } : {}),
  } as CSSProperties;

  function move(next: number, focus = false) {
    const option = options[(next + options.length) % options.length];
    if (!option) return;
    onChange(option.value);
    if (focus) {
      const buttons = ref.current?.querySelectorAll<HTMLButtonElement>(".mf-segmented-item");
      buttons?.[(next + options.length) % options.length]?.focus();
    }
  }

  return (
    <div
      ref={ref}
      className="mf-segmented"
      style={style}
      role="group"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); move(index + 1, true); }
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); move(index - 1, true); }
      }}
    >
      <span className="mf-segmented-indicator" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          className="mf-segmented-item"
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
