import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const id = useId();
  const trigger =
    isValidElement(children) && children.type !== undefined
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": id,
        })
      : children;

  return (
    <span className="mf-tooltip" data-mf-side={side}>
      {trigger}
      <span className="mf-tooltip-bubble" role="tooltip" id={id}>
        {label}
      </span>
    </span>
  );
}
