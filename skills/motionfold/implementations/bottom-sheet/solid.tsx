import { createEffect } from "solid-js";
import type { JSX } from "solid-js";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  duration?: number;
  children?: JSX.Element;
};

export function BottomSheet(props: BottomSheetProps) {
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  });

  return (
    <dialog
      ref={dialog}
      class="mf-sheet"
      style={props.duration ? { "--mf-sheet-duration": props.duration + "ms" } : undefined}
      onClose={props.onClose}
      onCancel={(event) => {
        event.preventDefault();
        props.onClose();
      }}
    >
      <div class="mf-sheet-handle" aria-hidden="true" />
      <div class="mf-sheet-header">
        <h2 class="mf-sheet-title">{props.title}</h2>
        <button class="mf-sheet-close" type="button" aria-label="Close" onClick={props.onClose}>×</button>
      </div>
      <div class="mf-sheet-body">{props.children}</div>
    </dialog>
  );
}
