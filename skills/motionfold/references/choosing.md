# Choosing a transition

A transition earns its place when it **explains a change**: where a surface came from, what
replaced what, or that an action succeeded. If it only decorates, skip it.

## The frequency gate

| How often the action happens | Motion budget |
|---|---|
| 100+ times a day (typing, command palette, keyboard navigation) | None, or a 1-frame opacity change |
| Dozens of times a day (opening a menu, switching tabs) | One quick, reversible transition |
| Daily (saving, sending, filtering) | Standard recipe timing |
| Rare or celebratory (payment, onboarding, a milestone) | Emphasis timing is allowed |

Never animate a keyboard-first surface with a spring, a bounce, or a large displacement. The
repetition turns delight into latency. See WCAG 2.3.3 (Animation from Interactions).

## Selection table

| Signal | Recipe | Why |
|---|---|---|
| A surface blocks the page for a decision | `modal` | Native dialog traps focus and returns it |
| A full-height panel enters from an edge | `drawer` | Same native guarantees, spatial origin |
| A menu is anchored to a trigger | `popover` | Origin-aware, light dismiss |
| A hint complements a control on hover/focus | `tooltip` | Non-essential, keyboard reachable |
| A transient confirmation appears | `toast` | A live region without stealing focus |
| A header reveals a body | `accordion` | In-place disclosure, no layout jump |
| Peer views share a moving indicator | `tabs` | Direction is horizontal and local |
| A boolean setting applies now | `switch` | Immediate affordance |
| Multiple selection in a form | `checkbox` | Native checked state |
| Loading with a known structure | `skeleton` | Preserves layout, announces busy |
| An action succeeded | `success-check` | Confirms, with text |
| Validation failed | `error-shake` | Draws the eye to one field |
| A short status label changes | `text-swap` | In-place, single announcement |
| List ↔ detail or step ↔ step | `page-slide` | Directional navigation |

## Tie-breakers

1. Prefer the lighter surface: popover over modal, toast over modal, tooltip over popover.
2. Prefer the native primitive: `<dialog>` over a custom overlay, Popover API over a custom
   menu, `<details>` or a disclosure over a custom collapsible when it fits.
3. Prefer reversible transitions (`transition`) over keyframes unless the recipe is a
   one-shot feedback (`success-check`, `error-shake`).
4. Prefer one moving element over many. Stagger only when the order carries meaning.
5. If two recipes still fit, apply the one that changes less of the user's structure.

## When not to animate

- A validation, save, or navigation that already has a clear system response.
- A page that loads in under 100 ms.
- A destructive action's confirmation dialog on repeat use.
- A keyboard shortcut path.
- A layout that would shift while the user is reading.
- Any place where the animation would be the only sign that something happened.

## Motion budget

One screen should have at most **one** attention-seeking motion at a time. Ambient loops
(shimmer, pulse) belong to loading states and must stop when off-screen or when motion is
reduced. A success celebration and a toast should not fire together unless the toast carries
different information.
