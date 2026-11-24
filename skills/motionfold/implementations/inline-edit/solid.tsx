import { createEffect, createSignal } from "solid-js";

type InlineEditProps = {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  duration?: number;
  easing?: string;
};

export function InlineEdit(props: InlineEditProps) {
  const [editing, setEditing] = createSignal(false);
  const [draft, setDraft] = createSignal(props.value);
  let input!: HTMLInputElement;
  let view!: HTMLButtonElement;

  createEffect(() => {
    if (!editing()) return;
    setDraft(props.value);
    requestAnimationFrame(() => { input?.focus(); input?.select(); });
  });

  function save() {
    const next = draft().trim();
    if (next) props.onSave(next);
    setEditing(false);
    requestAnimationFrame(() => view?.focus());
  }

  function cancel() {
    setDraft(props.value);
    setEditing(false);
    requestAnimationFrame(() => view?.focus());
  }

  return (
    <div class="mf-inline-edit" data-mf-editing={editing()} style={{
      ...(props.duration ? { "--mf-inline-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-inline-ease": props.easing } : {}),
    }}>
      <button ref={view} class="mf-inline-edit-view" type="button" aria-label={"Edit " + (props.label ?? "Project name")} onClick={() => setEditing(true)}>
        <span class="mf-inline-edit-label">{props.value}</span>
        <span class="mf-inline-edit-pencil" aria-hidden="true">✎</span>
      </button>
      <form class="mf-inline-edit-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <input ref={input} class="mf-inline-edit-input" value={draft()} aria-label={props.label ?? "Project name"} onInput={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }} onBlur={save} />
      </form>
    </div>
  );
}
