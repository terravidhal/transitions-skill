# Accordion

A disclosure whose panel grows and shrinks in place, with a chevron that flips.

## Use it when

- A settings group, FAQ, filter section, or "show more" reveals a body.
- The content is secondary and the header stays visible.

## Avoid it when

- The content is primary navigation or must always be visible.
- The sections are peer views: use `tabs`.

## Anatomy

```html
<div class="mf-accordion" data-mf-open="false">
  <button class="mf-accordion-trigger" type="button" id="faq-1-trigger" aria-expanded="false" aria-controls="faq-1-panel">
    <span>Shipping</span>
    <span class="mf-accordion-chevron" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
  <div class="mf-accordion-panel" id="faq-1-panel" role="region" aria-labelledby="faq-1-trigger" inert>
    <div class="mf-accordion-inner">…</div>
  </div>
</div>
```

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-accordion-duration` | `--mf-duration-base` | Symmetric expand/collapse |
| `--mf-accordion-ease` | `--mf-ease` | Curve |
| `--mf-accordion-blur` | `--mf-blur-sm` | Body blur while closed |

Height comes from `grid-template-rows: 0fr → 1fr`, so no JavaScript measures anything. The
chevron flips with `scaleY(-1)`, which passes through a flat line and works in every browser
(unlike CSS `d:` path interpolation).

## Accessibility

- Trigger is a real `<button>` with `aria-expanded` and `aria-controls`.
- The closed panel keeps `inert`; do not leave focusable links reachable while collapsed.
- `role="region"` and `aria-labelledby` make the panel a landmark with a name.
- Do not use a clickable `<div>`.

## Pitfalls

- Padding on the grid track leaves a strip when closed. Put it on the inner element.
- Do not animate a fixed pixel height; content size is unknown.
- Do not morph the chevron path with `d:`; it is Chromium-only.
- Keep the transition on the track and the inner opacity/blur in sync so the body does not
  appear before the space exists.
- Under reduced motion, collapse instantly and remove the blur.
