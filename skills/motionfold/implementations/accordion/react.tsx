import { useId, type CSSProperties, type ReactNode } from "react";

type AccordionProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  duration?: number;
  easing?: string;
};

export function Accordion({ title, open, onOpenChange, children, duration, easing }: AccordionProps) {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  const style = {
    ...(duration ? { "--mf-accordion-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-accordion-ease": easing } : {}),
  } as CSSProperties;

  return (
    <div className="mf-accordion" data-mf-open={open} style={style}>
      <button
        className="mf-accordion-trigger"
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        <span>{title}</span>
        <span className="mf-accordion-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="mf-accordion-panel" id={panelId} role="region" aria-labelledby={triggerId} inert={!open}>
        <div className="mf-accordion-inner">{children}</div>
      </div>
    </div>
  );
}
