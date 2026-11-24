// Page-slide behavior: run a DOM update inside a view transition, with a fallback.
import { motionAllowed, supportsViewTransition, withViewTransition } from "../_shared/view-transition.js";

export function setupPageSlide(container) {
  if (!container) return null;
  const pages = [...container.querySelectorAll("[data-mf-page]")];
  let current = pages.findIndex((page) => !page.hidden);

  function focusHeading(page) {
    const heading = page.querySelector("h1, h2, h3");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  function show(index, { direction = "forward", focus = true } = {}) {
    const next = pages[index];
    if (!next) return;

    const update = () => {
      for (const page of pages) {
        page.hidden = page !== next;
        page.classList.remove("mf-page-enter");
      }
      next.hidden = false;
    };

    if (!motionAllowed() || !supportsViewTransition()) {
      update();
      if (motionAllowed()) {
        next.classList.add("mf-page-enter");
        setTimeout(() => next.classList.remove("mf-page-enter"), 400);
      }
    } else {
      withViewTransition(update, { direction });
    }

    current = index;
    if (focus) requestAnimationFrame(() => focusHeading(next));
  }

  return {
    show,
    next(options) {
      show(Math.min(current + 1, pages.length - 1), { direction: "forward", ...options });
    },
    back(options) {
      show(Math.max(current - 1, 0), { direction: "back", ...options });
    },
  };
}
