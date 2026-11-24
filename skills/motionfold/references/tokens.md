# Tokens and one-line tuning

`implementations/_shared/motion.css` is the only required stylesheet. It defines a small
scale, then maps each recipe onto semantic names.

## Global scale

| Token | Default | Usage |
|---|---|---|
| `--mf-scale` | `1` | Multiplies every duration. `0.8` = 20% faster, `1.2` = 20% slower |
| `--mf-distance` | `1` | Multiplies every displacement. `0` = no travel |
| `--mf-blur` | `1` | Multiplies blur radii. `0` = no blur |
| `--mf-ease` | `cubic-bezier(.22,1,.36,1)` | Default open/close curve |
| `--mf-ease-out` | `cubic-bezier(.33,1,.68,1)` | Small surfaces entering |
| `--mf-ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Symmetric swaps |
| `--mf-ease-spring` | `cubic-bezier(.34,1.28,.64,1)` | Small controls only |
| `--mf-ease-linear` | `linear` | Loading loops |

Durations: `--mf-duration-micro` (80), `--mf-duration-fast` (150), `--mf-duration-base`
(240), `--mf-duration-slow` (360), `--mf-duration-emphasis` (500). Distances:
`--mf-distance-xs` (2), `-sm` (4), `-md` (8), `-lg` (16), `-xl` (32). Blur: `--mf-blur-sm`
(2), `--mf-blur-md` (3).

## Recipe tokens

| Recipe | Tokens |
|---|---|
| modal | `--mf-modal-duration`, `--mf-modal-close-duration`, `--mf-modal-ease`, `--mf-modal-distance`, `--mf-modal-scale` |
| drawer | `--mf-drawer-duration`, `--mf-drawer-close-duration`, `--mf-drawer-ease`, `--mf-drawer-distance` |
| bottom-sheet | `--mf-sheet-duration`, `--mf-sheet-close-duration`, `--mf-sheet-ease`, `--mf-sheet-distance` |
| command-palette | `--mf-command-duration`, `--mf-command-close-duration`, `--mf-command-ease`, `--mf-command-distance`, `--mf-command-scale` |
| popover | `--mf-popover-duration`, `--mf-popover-close-duration`, `--mf-popover-ease`, `--mf-popover-distance`, `--mf-popover-scale` |
| dropdown | `--mf-dropdown-duration`, `--mf-dropdown-close-duration`, `--mf-dropdown-ease`, `--mf-dropdown-distance`, `--mf-dropdown-scale` |
| lightbox | `--mf-lightbox-duration`, `--mf-lightbox-close-duration`, `--mf-lightbox-ease`, `--mf-lightbox-scale` |
| tooltip | `--mf-tooltip-duration`, `--mf-tooltip-delay`, `--mf-tooltip-ease`, `--mf-tooltip-distance`, `--mf-tooltip-scale` |
| toast | `--mf-toast-duration`, `--mf-toast-close-duration`, `--mf-toast-ease`, `--mf-toast-distance`, `--mf-toast-scale` |
| banner | `--mf-banner-duration`, `--mf-banner-close-duration`, `--mf-banner-ease`, `--mf-banner-distance` |
| accordion | `--mf-accordion-duration`, `--mf-accordion-ease`, `--mf-accordion-blur` |
| tabs | `--mf-tabs-duration`, `--mf-tabs-ease`, `--mf-tabs-indicator` |
| segmented-control | `--mf-seg-duration`, `--mf-seg-ease`, `--mf-seg-index` |
| stepper | `--mf-stepper-duration`, `--mf-stepper-ease`, `--mf-stepper-distance` |
| switch | `--mf-switch-duration`, `--mf-switch-ease`, `--mf-switch-travel`, `--mf-switch-overshoot` |
| checkbox | `--mf-checkbox-duration`, `--mf-checkbox-ease`, `--mf-checkbox-draw-duration` |
| radio-group | `--mf-radio-duration`, `--mf-radio-ease`, `--mf-radio-dot-scale` |
| icon-swap | `--mf-icon-swap-duration`, `--mf-icon-swap-ease`, `--mf-icon-swap-rotate`, `--mf-icon-swap-scale` |
| skeleton | `--mf-skeleton-duration`, `--mf-skeleton-ease`, `--mf-skeleton-reveal-duration`, `--mf-skeleton-reveal-distance` |
| progress-bar | `--mf-progress-duration`, `--mf-progress-ease`, `--mf-progress-sheen` |
| inline-edit | `--mf-inline-duration`, `--mf-inline-ease`, `--mf-inline-distance` |
| success-check | `--mf-check-duration`, `--mf-check-ease`, `--mf-check-draw-duration`, `--mf-check-distance` |
| error-shake | `--mf-shake-duration`, `--mf-shake-ease`, `--mf-shake-distance` |
| spinner-to-check | `--mf-spinner-duration`, `--mf-spinner-ease`, `--mf-spinner-spin`, `--mf-spinner-draw` |
| like-button | `--mf-like-duration`, `--mf-like-ease`, `--mf-like-scale`, `--mf-like-burst-duration` |
| copy-button | `--mf-copy-duration`, `--mf-copy-ease`, `--mf-copy-scale` |
| number-pop | `--mf-number-duration`, `--mf-number-ease`, `--mf-number-scale`, `--mf-number-distance` |
| text-swap | `--mf-text-swap-duration`, `--mf-text-swap-ease`, `--mf-text-swap-distance`, `--mf-text-swap-blur` |
| page-slide | `--mf-page-duration`, `--mf-page-ease`, `--mf-page-distance`, `--mf-page-blur` |
| theme-reveal | `--mf-theme-duration`, `--mf-theme-ease`, `--mf-theme-radius` |

## Tune in one line

Everything, one line:

```css
:root { --mf-scale: 0.85; --mf-ease: cubic-bezier(0.2, 0.8, 0.2, 1); }
```

One recipe, one line:

```css
:root { --mf-modal-duration: 200ms; }
```

One instance, one line:

```css
.checkout-dialog { --mf-modal-distance: 0px; --mf-modal-scale: 0.99; }
```

Framework props only write these variables:

```tsx
<Modal open={open} duration={200} easing="ease-out" distance={4} />
```

The CSS remains the source of truth. Do not reimplement timing in JavaScript.

## Reduced motion

The shared stylesheet shrinks the scale, distance, and blur when the OS preference is on.
`data-motion="reduced"` and `data-motion="full"` on `<html>` override the preference for a
product setting, a demo, or a test. Each recipe also ships a literal
`@media (prefers-reduced-motion: reduce)` block, so a single CSS file works without the
shared layer.

## Migrating an existing project

1. Replace `transition: all` with the properties the state actually changes.
2. Map literals to tokens **by usage**, not by nearest number. A 300 ms modal close maps to
   `--mf-modal-close-duration` because both mean "modal close", even though the values differ.
3. Add a reduced-motion guard if none exists.
4. Keep the project's easings when they are coherent; otherwise converge on `--mf-ease`.
5. Add motionfold variables beside the project's variables; never rename theirs.
