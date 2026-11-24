import type { JSX } from "solid-js";

type SkeletonProps = {
  ready: boolean;
  children: JSX.Element;
  label?: string;
  loadedLabel?: string;
  duration?: number;
};

export function Skeleton(props: SkeletonProps) {
  const style = () => (props.duration ? `--mf-skeleton-reveal-duration:${props.duration}ms` : "");

  return (
    <div
      class="mf-skeleton"
      data-mf-state={props.ready ? "ready" : "loading"}
      aria-busy={!props.ready}
      style={style()}
    >
      <div class="mf-skeleton-placeholder" aria-hidden="true">
        <span class="mf-skeleton-block" />
        <span class="mf-skeleton-line" data-width="medium" />
        <span class="mf-skeleton-line" data-width="short" />
      </div>
      <div class="mf-skeleton-content">{props.children}</div>
      <span class="mf-sr-only" role="status">
        {props.ready ? (props.loadedLabel ?? "Content loaded") : (props.label ?? "Loading")}
      </span>
    </div>
  );
}
