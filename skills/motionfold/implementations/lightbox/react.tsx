import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  caption?: string;
  duration?: number;
  children: ReactNode;
};

export function Lightbox({ open, onClose, caption, duration, children }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const style = duration ? ({ "--mf-lightbox-duration": duration + "ms" } as CSSProperties) : undefined;

  return (
    <dialog ref={ref} className="mf-lightbox" style={style} onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <figure className="mf-lightbox-figure">
        <div className="mf-lightbox-image" role="img" aria-label={caption ?? "Preview"}>
          {children}
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
      <button className="mf-lightbox-close" type="button" aria-label="Close" onClick={onClose}>×</button>
    </dialog>
  );
}
