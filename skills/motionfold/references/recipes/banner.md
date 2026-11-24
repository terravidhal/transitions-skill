# Banner

**Family:** surface · **Primitive:** `live-region`

## Use it when

A page-level message should appear in flow and stay until dismissed or resolved.

## Avoid it when

A transient confirmation (use toast) or a blocking decision (use modal).

## State

`data-mf-state="open|closing|closed"` on the banner; the text stays mounted while it leaves.

## Contract

- **Tokens:** `--mf-banner-duration`, `--mf-banner-close-duration`, `--mf-banner-ease`, `--mf-banner-distance`
- **Accessibility:** `role-status`, `aria-live`, `dismiss-button`, `not-focus-stealing`, `persistent-text`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

A banner is content, not a floating surface. It takes space in the layout, so the entrance must not push the page in a way that hides the trigger. Reserve the height before showing it, or insert it above the content and let the grid absorb the change.

## Pitfalls

- Do not insert a banner above the viewport without preserving scroll position.
- Do not remove the element before the exit completes; use the presence state.
- Do not rely on color alone; the copy must name the state.
