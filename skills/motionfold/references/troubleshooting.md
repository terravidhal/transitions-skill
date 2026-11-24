# Troubleshooting

## The surface pops open or closed

Cause: the element mounts and unmounts, or `display: none` is toggled with no exit path.
Fix: mount with `@starting-style` and transition `display`/`overlay` with
`transition-behavior: allow-discrete` (modal, drawer, popover), or keep the surface mounted
and toggle `data-mf-state` for the duration of the exit (toast, skeleton). Never wait for a
timer that guesses the state.

## The first open jumps from the closed position

Cause: the enter keyframes or starting style run on the initial page load.
Fix: render the resting state first, then add the open state after a frame. Use
`@starting-style` only for native `[open]` elements. Add the class in an effect or after
`requestAnimationFrame`, never during the initial HTML parse.

## The close never completes

Cause: the code waits on `transitionend` but the transition was interrupted, the element was
removed, or reduced motion skipped it.
Fix: use the presence helper, which listens once and also has a timeout fallback. Check
`motionAllowed()` before waiting.

## The next open starts from the closing scale

Cause: the closing class is never removed after the exit.
Fix: clear the closing state in the transitionend handler and in the timeout fallback. Guard
the callback so a rapid re-open cancels it.

## The accordion leaves a thin strip

Cause: padding sits on the `0fr` grid track.
Fix: put all padding on the inner element that clips overflow, never on the track.

## The tabs pill flies in from zero on first paint

Cause: the indicator is measured without first enabling a "no transition" state.
Fix: set `--mf-tabs-no-animate: 1` or `transition: none`, write the transform and width,
force a reflow, then restore. Repeat on resize.

## The success check is already drawn before it animates

Cause: `stroke-dasharray` does not match the real path length.
Fix: measure with `path.getTotalLength()` on mount, or round up a static value by 1 px.

## The shake does not replay

Cause: the animation class is added while it is already present.
Fix: remove the state, force a reflow, then re-add it. Keep the shake class separate from the
invalid/error class.

## The toast steals focus

Cause: the toast container is focusable or receives programmatic focus.
Fix: toasts are not dialogs. Use a `role="status"` region, keep focus where it was, and give
the close button a normal tab stop.

## Reduced motion still moves

Cause: a literal `transition` remains, or a keyframe animation is not disabled.
Fix: use the tokens so the scale collapses, keep the recipe's literal
`@media (prefers-reduced-motion: reduce)` block, and add `animation: none` for keyframes. Test
with `data-motion="reduced"`.

## Blur causes jank on a large surface

Cause: `filter: blur()` on a full-screen element, especially while scrolling.
Fix: limit blur to small surfaces (popover, toast, text), use `--mf-blur: 0` on large
dialogs, and never animate blur and layout together.

## The dialog closes instantly on Escape

Cause: `cancel` is not intercepted, so the element is hidden before the exit runs.
Fix: call `preventDefault()` on `cancel`, run the close transition, then call `close()` when
it settles. Native `dialog` only animates the exit if it stays open until the transition
ends.

## Duplicate view-transition-name warnings

Cause: two elements share a name, including hidden duplicates.
Fix: set the name on exactly one element per view, or remove it from the outgoing view before
the update. Never put the same name on a list and its detail.

## Dark mode makes a surface invisible

Cause: a hard-coded background or a near-black mark on a dark backdrop.
Fix: use the project's surface tokens; check both themes; do not invert with CSS filters.
