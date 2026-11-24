import { useEffect, useRef, type ReactNode } from "react";
import { withViewTransition } from "../_shared/view-transition.js";

export function navigatePage(update: () => void, direction: "forward" | "back" = "forward") {
  return withViewTransition(update, { direction });
}

type PageSlideProps = {
  pageKey: string;
  title: string;
  children: ReactNode;
};

export function PageSlide({ pageKey, title, children }: PageSlideProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(pageKey);

  useEffect(() => {
    if (previous.current === pageKey) return;
    previous.current = pageKey;
    heading.current?.focus({ preventScroll: true });
  }, [pageKey]);

  return (
    <section className="mf-page" data-mf-page={pageKey}>
      <h2 ref={heading} tabIndex={-1}>
        {title}
      </h2>
      {children}
    </section>
  );
}
