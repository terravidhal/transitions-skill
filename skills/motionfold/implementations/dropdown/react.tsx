import { useEffect, useRef, useState, type CSSProperties } from "react";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  duration?: number;
};

export function Dropdown({ label, options, value, onChange, duration }: DropdownProps) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<Array<HTMLLIElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));

  useEffect(() => {
    if (!open) return;
    items.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const current = options.find((option) => option.value === value);
  const style = duration ? ({ "--mf-dropdown-duration": duration + "ms" } as CSSProperties) : undefined;

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="mf-dropdown" data-mf-state={open ? "open" : "closed"} style={style}>
      <button
        ref={trigger}
        className="mf-dropdown-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); setOpen(true); }
        }}
      >
        <span className="mf-dropdown-value">{current?.label ?? label}</span>
        <span className="mf-dropdown-chevron" aria-hidden="true">⌄</span>
      </button>
      <ul
        className="mf-dropdown-list"
        role="listbox"
        aria-label={label}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => (value + 1) % options.length); }
          else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => (value - 1 + options.length) % options.length); }
          else if (event.key === "Home") { event.preventDefault(); setActive(0); }
          else if (event.key === "End") { event.preventDefault(); setActive(options.length - 1); }
          else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(active); }
          else if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
        }}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            ref={(element) => { items.current[index] = element; }}
            className="mf-dropdown-item"
            role="option"
            tabIndex={-1}
            aria-selected={option.value === value}
            data-active={index === active}
            onClick={() => choose(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
