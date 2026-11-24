import { useEffect, useRef, useState, type CSSProperties } from "react";

type InlineEditProps = {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  duration?: number;
  easing?: string;
};

export function InlineEdit({ value, onSave, label = "Project name", duration, easing }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const input = useRef<HTMLInputElement>(null);
  const view = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!editing) return;
    setDraft(value);
    requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
  }, [editing, value]);

  function save() {
    const next = draft.trim();
    if (next) onSave(next);
    setEditing(false);
    requestAnimationFrame(() => view.current?.focus());
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
    requestAnimationFrame(() => view.current?.focus());
  }

  const style = {
    ...(duration ? { "--mf-inline-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-inline-ease": easing } : {}),
  } as CSSProperties;

  return (
    <div className="mf-inline-edit" data-mf-editing={editing} style={style}>
      <button ref={view} className="mf-inline-edit-view" type="button" aria-label={"Edit " + label} onClick={() => setEditing(true)}>
        <span className="mf-inline-edit-label">{value}</span>
        <span className="mf-inline-edit-pencil" aria-hidden="true">✎</span>
      </button>
      <form className="mf-inline-edit-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <input
          ref={input}
          className="mf-inline-edit-input"
          value={draft}
          aria-label={label}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); cancel(); }
          }}
          onBlur={save}
        />
      </form>
    </div>
  );
}
