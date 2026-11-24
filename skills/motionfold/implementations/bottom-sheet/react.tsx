import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  duration?: number;
  children?: ReactNode;
};

export function BottomSheet({ open, onClose, title, duration, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const style = duration
    ? ({ "--mf-sheet-duration": duration + "ms" } as CSSProperties)
    : undefined;

  return (
    <dialog
      ref={ref}
      className="mf-sheet"
      style={style}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="mf-sheet-handle" aria-hidden="true" />
      <div className="mf-sheet-header">
        <h2 className="mf-sheet-title">{title}</h2>
        <button className="mf-sheet-close" type="button" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="mf-sheet-body">{children}</div>
    </dialog>
  );
}
