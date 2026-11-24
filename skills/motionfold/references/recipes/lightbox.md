# Lightbox

**Family:** surface · **Primitive:** `dialog`

## Use it when

An image or artwork opens for a closer look and the page waits behind it.

## Avoid it when

Inline media that should stay in the document flow (use a disclosure).

## State

A native `<dialog>` with a figure and a caption; `open` drives the scale and backdrop.

## Contract

- **Tokens:** `--mf-lightbox-duration`, `--mf-lightbox-close-duration`, `--mf-lightbox-ease`, `--mf-lightbox-scale`
- **Accessibility:** `focus-trap`, `escape`, `focus-return`, `aria-modal`, `image-alt`, `caption`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The lightbox is a modal for media. Keep a real caption and alt text; the animation is only the reveal. A shared-element effect is optional and must fall back to this scale when View Transitions are unavailable.

## Pitfalls

- Do not set the image as a CSS background if it carries meaning.
- Do not animate filters on very large images; keep the reveal to transform and opacity.
- Do not hide the close button behind the image on small screens.
