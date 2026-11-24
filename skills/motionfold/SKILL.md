---
name: motionfold
description: >-
  Add, fix, tune, or audit polished UI transitions (entrances, exits, state
  changes, navigation) in React, Vue, Svelte, Solid, or plain CSS/JS. Use when
  the user says "add a transition", "animate the modal", "make the drawer
  slide", "the dropdown pops", "smooth out this accordion", "swap this text",
  "show a success check", "shake the invalid field", "animate the skeleton",
  "slide between list and detail", "respect reduced motion", "speed up the
  animations", "use motion tokens", "audit our animations", or asks for a
  toast, tooltip, popover, tabs, switch, checkbox, skeleton, page transition,
  or feedback motion. Provides fourteen product-focused recipes, each with one
  CSS file and idiomatic React, Vue, Svelte, Solid, and vanilla implementations;
  prefers-reduced-motion is handled in every recipe; durations and easings are
  tunable in one line with --mf-scale or a single recipe token. Prefers native
  dialog, Popover, and View Transitions APIs, adds no runtime dependency, and
  never animates a keyboard-heavy action or uses motion as the only signal.
license: MIT
---

# motionfold — polished UI transitions for every stack

Your job is to choose the **smallest transition that explains a change**, then apply it
with the project's own conventions. motionfold is a curated deck of fourteen recipes, not a
catalogue of effects. Every recipe has one specification, one shared CSS file, and five
idiomatic implementations.

**If you remember one thing: motion explains a change; it never replaces the signal.**

## Non-negotiable rules

1. **Choose by element and intent, not by effect name.** Use the decision table. If no
   recipe matches, say so and propose the closest one instead of inventing an effect.
2. **Respect the frequency gate.** An action used 100+ times a day (command palette,
   keyboard navigation, typing) gets no motion, or a near-instant opacity change.
3. **Keep `prefers-reduced-motion`.** Every recipe ships a guard. Under reduced motion,
   drop displacement, scale, and blur; keep a short opacity or color change when it helps
   comprehension. Never remove the guard.
4. **Never use `transition: all`.** Name the properties the state actually changes.
5. **Animate `transform`, `opacity`, and `filter` by default.** Do not animate `width`,
   `height`, `top`, `left`, `margin`, or `padding` unless the recipe documents the reason
   (accordion grid rows, tabs indicator).
6. **Exit faster than entry.** A surface leaves the way it came, in less time. Exceptions
   are documented (tabs and accordion are symmetric).
7. **Never start from `scale(0)`.** Use the recipe's scale token.
8. **Motion is not the only signal.** Success, error, selection, and status need text,
   `role`, or `aria-*` too.
9. **No animation library.** Native primitives first: `<dialog>`, Popover API, View
   Transitions, `<details>`, native inputs. A component may use its own framework only.
10. **Do not restructure the user's component to fit a recipe.** Adapt classes, tokens, and
    accessibility to the existing markup.

## Workflow

### 0. Read the project

Identify the framework and version, styling (plain CSS, CSS Modules, Tailwind, CSS-in-JS),
existing motion tokens, naming conventions, and browser targets. Read `package.json`, the
nearest stylesheet, and two neighboring components. Do not guess.

### 1. Classify the intent

Surface opening or closing, state change, feedback, or navigation. Note how often the user
triggers it. If two recipes fit, take the lighter one.

### 2. Pick one recipe

Read [references/choosing.md](references/choosing.md), then the matching file under
`references/recipes/`. State the choice in one sentence before editing.

### 3. Check the frequency gate

100+ times a day: no transition. Occasional: standard timing. Rare or celebratory: the
emphasis timing is allowed. If the request contradicts the gate, explain and offer the quiet
alternative.

### 4. Lay the motion foundation

If the project has no motion tokens, copy `implementations/_shared/motion.css` once and
import it. If it already has tokens, map motionfold tokens onto them instead of creating a
second system. Then copy the recipe's `style.css` and the implementation for the detected
stack.

### 5. Wire state and accessibility

Use the documented state attribute (`data-mf-state`, `open`, `aria-expanded`,
`aria-checked`, `aria-selected`). Keep focus, keyboard, ARIA, `inert`, scroll lock, and live
regions intact. See [references/accessibility.md](references/accessibility.md).

### 6. Tune in one line

Prefer, in order: the project's tokens, a single `--mf-<recipe>-*` variable, then
`--mf-scale` / `--mf-ease` globally. See [references/tokens.md](references/tokens.md). Props
such as `duration`, `easing`, and `distance` in the framework components only write those
variables.

### 7. Verify

Run the checklist below. Then run the project's typecheck, lint, and build. Test reduced
motion, light/dark, keyboard, rapid open/close, interruption, resize, and mobile.

## Decision table

| What the user sees | Recipe | Not this |
|---|---|---|
| A surface blocks the page and asks for a decision | `modal` | toast, popover |
| A full-height panel enters from a screen edge | `drawer` | modal, popover |
| A menu or action panel grows from a trigger | `popover` | modal |
| A short hint appears on hover or focus | `tooltip` | popover |
| A transient message confirms an async action | `toast` | modal |
| A header reveals a body in place | `accordion` | tabs |
| Peer views swap with a moving indicator | `tabs` | accordion |
| A boolean setting applies immediately | `switch` | checkbox |
| Multiple selection or consent in a form | `checkbox` | switch |
| Loading with a known structure | `skeleton` | spinner |
| An action just succeeded | `success-check` | toast alone |
| A field failed validation | `error-shake` | success-check |
| A short status label changes in place | `text-swap` | page-slide |
| Two views of the same level change (list ↔ detail) | `page-slide` | tabs |
| No clear match | Ask; do not guess | an invented effect |

Full rules, including exclusions and tie-breakers, are in
[references/choosing.md](references/choosing.md).

## Commands

The skill exposes four namespaced verbs so it never collides with another skill:

- **`motionfold list`** — print the fourteen recipes with family, use, and reference file.
  No project access.
- **`motionfold audit [path]`** — run the deterministic audit
  (`node skills/motionfold/scripts/audit.mjs <path>`), show the score and findings grouped by
  file. Never edit. See [references/audit.md](references/audit.md).
- **`motionfold apply <recipe>`** — choose a recipe for the current context, confirm, then
  apply the CSS, the stack implementation, and the accessibility contract. If a recipe name
  is given, respect it.
- **`motionfold tune`** — find literal durations and easings, map them to tokens **by
  usage**, and propose replacements. Never edit without confirmation.

## Implementation contract

Every recipe, in every stack, satisfies the same contract:

1. An explicit state attribute or native state. No timer guesses the state.
2. An entry and an exit. The exit is faster unless the recipe is symmetric.
3. Tokens for duration, easing, and distance/scale. No magic numbers outside the shared
   stylesheet.
4. A `prefers-reduced-motion` guard plus the app-level `data-motion` override.
5. Native accessibility: focus, keyboard, ARIA, `inert`, scroll lock, live region as needed.
6. A reliable cleanup using `transitionend`/`animationend` with a timeout fallback, safe
   under interruption.
7. A complete vanilla example; the demo proves the CSS and behavior work without a framework.
8. No runtime dependency beyond the framework itself.

## Stacks in one look

| Stack | Files | Notes |
|---|---|---|
| Vanilla | `vanilla.js` + `style.css` | Import the CSS, call the exported setup function. |
| React | `react.tsx` + `style.css` | Function component, `useEffect` cleanup, no injected `<style>`. |
| Vue | `vue.vue` + `style.css` | `<script setup>`, `onMounted`/`onBeforeUnmount`, `v-model` friendly. |
| Svelte | `svelte.svelte` + `style.css` | Svelte 5 runes, actions in `$effect`, `bind:` friendly. |
| Solid | `solid.tsx` + `style.css` | Signals, `createEffect` with `onCleanup`. |

Details, SSR notes, Tailwind, and CSS Modules are in
[references/stacks.md](references/stacks.md).

## Which reference to read

| Task | Reference |
|---|---|
| Pick the right recipe, apply a frequency gate | [choosing.md](references/choosing.md) |
| Tune durations, easings, distances; migrate to tokens | [tokens.md](references/tokens.md) |
| Reduced motion, focus, ARIA, inert, live regions | [accessibility.md](references/accessibility.md) |
| React, Vue, Svelte, Solid, vanilla, SSR, Tailwind | [stacks.md](references/stacks.md) |
| Run and read the deterministic audit | [audit.md](references/audit.md) |
| Diagnose popping, stuck exits, layout jank | [troubleshooting.md](references/troubleshooting.md) |
| Recipe: modal | [recipes/modal.md](references/recipes/modal.md) |
| Recipe: drawer | [recipes/drawer.md](references/recipes/drawer.md) |
| Recipe: popover | [recipes/popover.md](references/recipes/popover.md) |
| Recipe: tooltip | [recipes/tooltip.md](references/recipes/tooltip.md) |
| Recipe: toast | [recipes/toast.md](references/recipes/toast.md) |
| Recipe: accordion | [recipes/accordion.md](references/recipes/accordion.md) |
| Recipe: tabs | [recipes/tabs.md](references/recipes/tabs.md) |
| Recipe: switch | [recipes/switch.md](references/recipes/switch.md) |
| Recipe: checkbox | [recipes/checkbox.md](references/recipes/checkbox.md) |
| Recipe: skeleton | [recipes/skeleton.md](references/recipes/skeleton.md) |
| Recipe: success check | [recipes/success-check.md](references/recipes/success-check.md) |
| Recipe: error shake | [recipes/error-shake.md](references/recipes/error-shake.md) |
| Recipe: text swap | [recipes/text-swap.md](references/recipes/text-swap.md) |
| Recipe: page slide | [recipes/page-slide.md](references/recipes/page-slide.md) |

## Before you finish

- [ ] The recipe matches the visible element and the intent; no effect was invented.
- [ ] The frequency gate was applied; a keyboard-heavy action stays quiet.
- [ ] Every duration, easing, and distance comes from a token or a single documented variable.
- [ ] The `prefers-reduced-motion` guard is present and the `data-motion` override works.
- [ ] The exit is present, faster than the entry, and survives a rapid re-open.
- [ ] No `transition: all`, no layout animation without a documented reason, no `scale(0)`.
- [ ] Focus enters and returns correctly; Escape, Tab, and arrows work; the background is inert.
- [ ] The meaning is available as text or ARIA; motion is not the only signal.
- [ ] Light/dark, resize, and mobile were checked; the build, typecheck, and lint pass.
- [ ] The project's naming and tokens were preserved; no animation library was added.

## Report

When done, state:

1. The files changed, with paths.
2. The recipe chosen and why, in one sentence.
3. The tokens used or overridden.
4. What was verified: reduced motion, light/dark, keyboard and focus, interruption, build/lint.
5. Any limitation: popover positioning, browser fallback, or an existing library that conflicts.
