import { createEffect, createSignal, createUniqueId, type JSX } from "solid-js";

type PopoverProps = {
  label: string;
  children: JSX.Element;
  duration?: number;
  easing?: string;
  distance?: number;
  scale?: number;
};

export function Popover(props: PopoverProps) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  let trigger!: HTMLButtonElement;
  let panel!: HTMLDivElement;

  function position() {
    const rect = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    let side = "bottom";
    if (rect.bottom + 8 + height > window.innerHeight && rect.top - 8 - height > 0) side = "top";
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = side === "top" ? rect.top - 8 - height : rect.bottom + 8;
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(8, top)}px`;
    panel.dataset.mfSide = side;
  }

  function toggle() {
    if (panel.matches(":popover-open")) panel.hidePopover();
    else {
      panel.showPopover();
      position();
    }
  }

  createEffect(() => {
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      setOpen(next);
      trigger.setAttribute("aria-expanded", String(next));
      if (next) {
        position();
        requestAnimationFrame(position);
        panel.querySelector<HTMLElement>('[role="menuitem"], a, button')?.focus();
      } else if (panel.contains(document.activeElement)) {
        trigger.focus();
      }
    };
    panel.addEventListener("toggle", onToggle);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      panel.removeEventListener("toggle", onToggle);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  });

  const style = () =>
    [
      props.duration ? `--mf-popover-duration:${props.duration}ms` : "",
      props.easing ? `--mf-popover-ease:${props.easing}` : "",
      props.distance ? `--mf-popover-distance:${props.distance}px` : "",
      props.scale ? `--mf-popover-scale:${props.scale}` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open()}
        aria-controls={id}
        aria-haspopup="menu"
        onClick={(event) => {
          event.preventDefault();
          toggle();
        }}
      >
        {props.label}
      </button>
      <div ref={panel} id={id} popover="auto" class="mf-popover" role="menu" style={style()}>
        {props.children}
      </div>
    </>
  );
}
