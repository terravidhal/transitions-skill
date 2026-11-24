import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  duration?: number;
  easing?: string;
  distance?: string;
};

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  side = "right",
  duration,
  easing,
  distance,
}: DrawerProps) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onOpenChange(false);
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onOpenChange]);

  const style = {
    ...(duration ? { "--mf-drawer-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-drawer-ease": easing } : {}),
    ...(distance ? { "--mf-drawer-distance": distance } : {}),
  } as CSSProperties;

  return (
    <dialog
      ref={ref}
      className="mf-drawer"
      data-side={side}
      aria-labelledby={titleId}
      style={style}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === ref.current) onOpenChange(false);
      }}
    >
      <div className="mf-drawer-header">
        <h2 className="mf-drawer-title" id={titleId}>
          {title}
        </h2>
        <button className="mf-drawer-close" type="button" aria-label="Close" onClick={() => onOpenChange(false)}>
          ×
        </button>
      </div>
      <div className="mf-drawer-body">{children}</div>
    </dialog>
  );
}
