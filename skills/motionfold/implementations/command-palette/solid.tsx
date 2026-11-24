import { createEffect, createSignal, For, Show } from "solid-js";

export type Command = { id: string; label: string; hint?: string };

type CommandPaletteProps = {
  open: boolean;
  commands: Command[];
  onClose: () => void;
  onRun: (id: string) => void;
  duration?: number;
};

export function CommandPalette(props: CommandPaletteProps) {
  let dialog!: HTMLDialogElement;
  let input!: HTMLInputElement;
  const [query, setQuery] = createSignal("");
  const [active, setActive] = createSignal(0);
  const visible = () => props.commands.filter((command) => command.label.toLowerCase().includes(query().toLowerCase()));

  createEffect(() => {
    if (props.open && !dialog.open) {
      dialog.showModal();
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => input?.focus());
    } else if (!props.open && dialog.open) dialog.close();
  });

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => (value + 1) % Math.max(1, visible().length)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => (value - 1 + visible().length) % Math.max(1, visible().length)); }
    else if (event.key === "Enter" && visible()[active()]) { event.preventDefault(); props.onRun(visible()[active()].id); props.onClose(); }
  }

  return (
    <dialog ref={dialog} class="mf-command" style={props.duration ? { "--mf-command-duration": props.duration + "ms" } : undefined} onClose={props.onClose} onCancel={(event) => { event.preventDefault(); props.onClose(); }}>
      <input ref={input} class="mf-command-input" type="search" value={query()} aria-label="Search commands" onInput={(event) => { setQuery(event.currentTarget.value); setActive(0); }} onKeyDown={onKeyDown} />
      <ul class="mf-command-list" role="listbox" aria-label="Commands">
        <For each={visible()}>
          {(command, index) => (
            <li class="mf-command-item" role="option" aria-selected={index() === active()} onClick={() => { props.onRun(command.id); props.onClose(); }}>
              {command.label}<Show when={command.hint}><span>{command.hint}</span></Show>
            </li>
          )}
        </For>
      </ul>
      <p class="mf-command-hint">↑↓ to move · Enter to run · Esc to close</p>
    </dialog>
  );
}
