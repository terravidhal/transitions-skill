import { createEffect, createUniqueId, type JSX } from "solid-js";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: JSX.Element;
  duration?: number;
  easing?: string;
  distance?: number;
  closeLabel?: string;
};

export function Modal(props: ModalProps) {
  const titleId = createUniqueId();
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  });

  const style = () =>
    [
      props.duration ? `--mf-modal-duration:${props.duration}ms` : "",
      props.easing ? `--mf-modal-ease:${props.easing}` : "",
      props.distance ? `--mf-modal-distance:${props.distance}px` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <dialog
      ref={dialog}
      class="mf-modal"
      aria-labelledby={titleId}
      aria-modal="true"
      style={style()}
      onCancel={(event) => {
        event.preventDefault();
        props.onOpenChange(false);
      }}
      onClose={() => props.onOpenChange(false)}
      onClick={(event) => {
        if (event.target === dialog) props.onOpenChange(false);
      }}
    >
      <div class="mf-modal-header">
        <h2 class="mf-modal-title" id={titleId}>
          {props.title}
        </h2>
        <button
          class="mf-modal-close"
          type="button"
          aria-label={props.closeLabel ?? "Close"}
          onClick={() => props.onOpenChange(false)}
        >
          ×
        </button>
      </div>
      <div class="mf-modal-body">{props.children}</div>
    </dialog>
  );
}
