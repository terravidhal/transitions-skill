import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  duration?: number;
  easing?: string;
  distance?: number;
  closeLabel?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  duration,
  easing,
  distance,
  closeLabel = "Close",
}: ModalProps) {
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
    ...(duration ? { "--mf-modal-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-modal-ease": easing } : {}),
    ...(distance ? { "--mf-modal-distance": `${distance}px` } : {}),
  } as CSSProperties;

  return (
    <dialog
      ref={ref}
      className="mf-modal"
      aria-labelledby={titleId}
      aria-modal="true"
      style={style}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === ref.current) onOpenChange(false);
      }}
    >
      <div className="mf-modal-header">
        <h2 className="mf-modal-title" id={titleId}>
          {title}
        </h2>
        <button className="mf-modal-close" type="button" aria-label={closeLabel} onClick={() => onOpenChange(false)}>
          ×
        </button>
      </div>
      <div className="mf-modal-body">{children}</div>
    </dialog>
  );
}
