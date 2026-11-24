import { useEffect, useRef, useState, type CSSProperties } from "react";

export type Command = { id: string; label: string; hint?: string };

type CommandPaletteProps = {
  open: boolean;
  commands: Command[];
  onClose: () => void;
  onRun: (id: string) => void;
  duration?: number;
};

export function CommandPalette({ open, commands, onClose, onRun, duration }: CommandPaletteProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const visible = commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()));
  const style = duration ? ({ "--mf-command-duration": duration + "ms" } as CSSProperties) : undefined;

  return (
    <dialog ref={ref} className="mf-command" aria-label="Command palette" aria-modal="true" style={style} onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <input
        ref={input}
        className="mf-command-input"
        type="search"
        value={query}
        aria-label="Search commands"
        onChange={(event) => { setQuery(event.target.value); setActive(0); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => (value + 1) % Math.max(1, visible.length)); }
          else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => (value - 1 + visible.length) % Math.max(1, visible.length)); }
          else if (event.key === "Enter" && visible[active]) { event.preventDefault(); onRun(visible[active].id); onClose(); }
        }}
      />
      <ul className="mf-command-list" role="listbox" aria-label="Commands">
        {visible.map((command, index) => (
          <li
            key={command.id}
            className="mf-command-item"
            role="option"
            aria-selected={index === active}
            onClick={() => { onRun(command.id); onClose(); }}
          >
            {command.label}
            {command.hint ? <span>{command.hint}</span> : null}
          </li>
        ))}
      </ul>
      <p className="mf-command-hint">↑↓ to move · Enter to run · Esc to close</p>
    </dialog>
  );
}
