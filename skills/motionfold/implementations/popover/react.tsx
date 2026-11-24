import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

type PopoverProps = {
  label: string;
  children: ReactNode;
  duration?: number;
  easing?: string;
  distance?: number;
  scale?: number;
};

export function Popover({ label, children, duration, easing, distance, scale }: PopoverProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = panel.current;
    const button = trigger.current;
    if (!element || !button) return;

    const position = () => {
      const rect = button.getBoundingClientRect();
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      let side = "bottom";
      if (rect.bottom + 8 + height > window.innerHeight && rect.top - 8 - height > 0) side = "top";
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const top = side === "top" ? rect.top - 8 - height : rect.bottom + 8;
      element.style.left = `${left}px`;
      element.style.top = `${Math.max(8, top)}px`;
      element.dataset.mfSide = side;
    };

    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      setOpen(next);
      button.setAttribute("aria-expanded", String(next));
      if (next) {
        position();
        requestAnimationFrame(position);
        element.querySelector<HTMLElement>('[role="menuitem"], a, button')?.focus();
      } else if (element.contains(document.activeElement)) {
        button.focus();
      }
    };

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      if (element.matches(":popover-open")) element.hidePopover();
      else {
        element.showPopover();
        position();
      }
    };

    button.addEventListener("click", onClick);
    element.addEventListener("toggle", onToggle);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      button.removeEventListener("click", onClick);
      element.removeEventListener("toggle", onToggle);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, []);

  const style = {
    ...(duration ? { "--mf-popover-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-popover-ease": easing } : {}),
    ...(distance ? { "--mf-popover-distance": `${distance}px` } : {}),
    ...(scale ? { "--mf-popover-scale": String(scale) } : {}),
  } as CSSProperties;

  return (
    <>
      <button ref={trigger} type="button" aria-expanded={open} aria-controls={id} aria-haspopup="menu">
        {label}
      </button>
      <div ref={panel} id={id} popover="auto" className="mf-popover" role="menu" style={style}>
        {children}
      </div>
    </>
  );
}
