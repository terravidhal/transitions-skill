import { createUniqueId, type JSX } from "solid-js";

type AccordionProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: JSX.Element;
  duration?: number;
  easing?: string;
};

export function Accordion(props: AccordionProps) {
  const id = createUniqueId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const style = () =>
    [
      props.duration ? `--mf-accordion-duration:${props.duration}ms` : "",
      props.easing ? `--mf-accordion-ease:${props.easing}` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <div class="mf-accordion" data-mf-open={props.open} style={style()}>
      <button
        class="mf-accordion-trigger"
        type="button"
        id={triggerId}
        aria-expanded={props.open}
        aria-controls={panelId}
        onClick={() => props.onOpenChange(!props.open)}
      >
        <span>{props.title}</span>
        <span class="mf-accordion-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6.5L8 10.5L12 6.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <div class="mf-accordion-panel" id={panelId} role="region" aria-labelledby={triggerId} inert={!props.open}>
        <div class="mf-accordion-inner">{props.children}</div>
      </div>
    </div>
  );
}
