import { createEffect, type JSX } from "solid-js";
import { withViewTransition } from "../_shared/view-transition.js";

export function navigatePage(update: () => void, direction: "forward" | "back" = "forward") {
  return withViewTransition(update, { direction });
}

type PageSlideProps = {
  pageKey: string;
  title: string;
  children: JSX.Element;
};

export function PageSlide(props: PageSlideProps) {
  let heading!: HTMLHeadingElement;
  let previous = props.pageKey;

  createEffect(() => {
    if (previous === props.pageKey) return;
    previous = props.pageKey;
    heading?.focus({ preventScroll: true });
  });

  return (
    <section class="mf-page" data-mf-page={props.pageKey}>
      <h2 ref={heading} tabIndex={-1}>
        {props.title}
      </h2>
      {props.children}
    </section>
  );
}
