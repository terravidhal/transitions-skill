import { createUniqueId, type JSX } from "solid-js";

type TooltipProps = {
  label: string;
  children: JSX.Element;
  side?: "top" | "bottom" | "left" | "right";
};

export function Tooltip(props: TooltipProps) {
  const id = createUniqueId();
  return (
    <span class="mf-tooltip" data-mf-side={props.side ?? "top"}>
      <span class="mf-tooltip-anchor" aria-describedby={id}>
        {props.children}
      </span>
      <span class="mf-tooltip-bubble" role="tooltip" id={id}>
        {props.label}
      </span>
    </span>
  );
}
