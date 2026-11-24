import type { CSSProperties, ReactNode } from "react";

type SkeletonProps = {
  ready: boolean;
  children: ReactNode;
  label?: string;
  loadedLabel?: string;
  duration?: number;
};

export function Skeleton({ ready, children, label = "Loading", loadedLabel = "Content loaded", duration }: SkeletonProps) {
  const style = {
    ...(duration ? { "--mf-skeleton-reveal-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <div className="mf-skeleton" data-mf-state={ready ? "ready" : "loading"} aria-busy={!ready} style={style}>
      <div className="mf-skeleton-placeholder" aria-hidden="true">
        <span className="mf-skeleton-block" />
        <span className="mf-skeleton-line" data-width="medium" />
        <span className="mf-skeleton-line" data-width="short" />
      </div>
      <div className="mf-skeleton-content">{children}</div>
      <span className="mf-sr-only" role="status">
        {ready ? loadedLabel : label}
      </span>
    </div>
  );
}
