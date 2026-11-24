import { createEffect, createUniqueId, type JSX } from "solid-js";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: JSX.Element;
  side?: "left" | "right";
  duration?: number;
  easing?: string;
  distance?: string;
};

export function Drawer(props: DrawerProps) {
  const titleId = createUniqueId();
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  });

  const style = () =>
    [
      props.duration ? `--mf-drawer-duration:${props.duration}ms` : "",
      props.easing ? `--mf-drawer-ease:${props.easing}` : "",
      props.distance ? `--mf-drawer-distance:${props.distance}` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <dialog
      ref={dialog}
      class="mf-drawer"
      data-side={props.side ?? "right"}
      aria-labelledby={titleId}
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
      <div class="mf-drawer-header">
        <h2 class="mf-drawer-title" id={titleId}>
          {props.title}
        </h2>
        <button class="mf-drawer-close" type="button" aria-label="Close" onClick={() => props.onOpenChange(false)}>
          ×
        </button>
      </div>
      <div class="mf-drawer-body">{props.children}</div>
    </dialog>
  );
}
