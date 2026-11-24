# Number pop

**Family:** feedback · **Primitive:** `output`

## Use it when

A small count or quantity changes and the new value deserves a beat.

## Avoid it when

Continuously updating telemetry or a value read every second.

## State

`data-mf-bump="true"` restarts a one-shot keyframe after the text changes.

## Contract

- **Tokens:** `--mf-number-duration`, `--mf-number-ease`, `--mf-number-scale`, `--mf-number-distance`
- **Accessibility:** `output`, `aria-live-polite`, `tabular-nums`, `readable-value`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

A number pop is a punctuation mark, not a metronome. Only animate an explicit user action, never a polling counter. Keep font-variant-numeric: tabular-nums so the value does not reflow, and expose the final number as text.

## Pitfalls

- Do not bump on every render; trigger on a value change.
- Do not animate a price or a score without a reduced-motion path.
- Do not animate the container's width.
