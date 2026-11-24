# Stacks

The CSS is identical everywhere. Only the state wiring changes. Every implementation imports
the framework it belongs to and nothing else.

## Shared setup

1. Import `implementations/_shared/motion.css` once in the app shell.
2. Import the recipe `style.css` where the component lives, or add it to the global stylesheet.
3. Pick the implementation file for the detected framework and adapt class names only if the
   project has a strict convention. Keep the `mf-*` names otherwise.

## Vanilla

```js
import { createPresence } from "../_shared/presence.vanilla.js";

const el = document.querySelector("[data-mf-toast]");
const presence = createPresence(el, { closeToken: "--mf-toast-close-duration" });
presence.open();
```

Each recipe also exports a small setup function from its `vanilla.js`, so the markup can be
declarative. The demo in `examples/` imports the real files, not copies.

## React

- Function component, no injected `<style>`, no `useLayoutEffect` unless measuring.
- Measure the tabs indicator and the success path in `useLayoutEffect` or a ref callback.
- Return the focus and remove listeners in the `useEffect` cleanup.
- SSR: guard `document` and `window`. Native `<dialog>` and `showPopover()` only run in an
  effect, never during render.
- Accept `duration`, `easing`, and `distance` props and write them as inline CSS variables.

```tsx
<Modal open={open} onOpenChange={setOpen} duration={200} easing="ease-out" />
```

## Vue

- `<script setup lang="ts">`; emit `update:open` so `v-model:open` works.
- Use `onMounted` for dialog/popover calls and `onBeforeUnmount` for cleanup.
- Keep `aria-*` bindings explicit; do not rely on attribute fallthrough for state.
- Props mirror React and write inline CSS variables.

```vue
<Modal v-model:open="open" :duration="200" easing="ease-out" />
```

## Svelte

- Svelte 5 runes: `$props`, `$state`, `$effect`, `bind:open`.
- Native calls belong in `$effect`; return a cleanup from it.
- Svelte transitions are not used: the recipe CSS must stay portable and interruptible.
- Props mirror React and write inline CSS variables.

```svelte
<Modal bind:open duration={200} easing="ease-out" />
```

## Solid

- Signals and `createEffect`; always pair with `onCleanup`.
- Use `ref` callbacks for native dialog/popover calls, not `onMount` when the element can
  remount.
- `open` is a prop plus an `onOpenChange` callback; keep it controlled.
- Props mirror React and write inline CSS variables.

```tsx
<Modal open={open()} onOpenChange={setOpen} duration={200} easing="ease-out" />
```

## Styling systems

### Tailwind

Keep the recipe CSS as CSS. Add the `mf-*` class to the element and let Tailwind handle
layout and color. Do not translate motion into arbitrary values like `duration-[240ms]`; set
the token once on `:root` or on the component.

### CSS Modules

Import the recipe CSS as a module and expose the class names through `:global` for the state
selectors, or rename the selectors consistently. Keep `data-mf-state` untouched: it is the
contract.

### CSS-in-JS

Prefer moving the recipe CSS into a real stylesheet. If that is impossible, keep the token
names and the reduced-motion guard; a `@media` rule inside a template literal still works in
most tools.

## SSR and hydration

- Do not read `matchMedia` during render.
- The first render must be the resting state. Native dialog/popover calls run only after the
  element exists.
- The tabs indicator should be measured on mount with transitions disabled, then animated.
- A success path length must be measured on mount; never assume it during SSR.

## Existing animation libraries

If the project already uses Motion/Framer Motion, GSAP, or Anime.js, do not add motionfold as
a second engine. Port the recipe's **contract** (tokens, exit faster than entry, reduced
motion, accessibility) into the library already present. Mention the overlap in the report.
