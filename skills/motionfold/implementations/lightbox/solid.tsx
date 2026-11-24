import { createEffect } from "solid-js";
import type { JSX } from "solid-js";

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  caption?: string;
  duration?: number;
  children: JSX.Element;
};

export function Lightbox(props: LightboxProps) {
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  });

  return (
    <dialog ref={dialog} class="mf-lightbox" aria-label={props.caption ?? "Image preview"} aria-modal="true" style={props.duration ? { "--mf-lightbox-duration": props.duration + "ms" } : undefined} onClose={props.onClose} onCancel={(event) => { event.preventDefault(); props.onClose(); }}>
      <figure class="mf-lightbox-figure">
        <div class="mf-lightbox-image" role="img" aria-label={props.caption ?? "Preview"}>{props.children}</div>
        {props.caption ? <figcaption>{props.caption}</figcaption> : null}
      </figure>
      <button class="mf-lightbox-close" type="button" aria-label="Close" onClick={props.onClose}>×</button>
    </dialog>
  );
}
