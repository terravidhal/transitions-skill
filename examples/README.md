# Examples

## The live demo

A zero-build gallery of the thirty recipes, importing the real implementations from
`../skills/motionfold/`.

```bash
npm run demo
```

Open <http://localhost:4173/examples/index.html>. The server is `server.mjs`, a tiny static
server with no dependency.

### What you can change

- **Theme**: light and dark, applied to the whole page.
- **Motion**: `Auto` (follow the OS), `Reduced`, or `Full` via `data-motion`.
- **Speed**: a 0.5×–1.5× slider that writes `--mf-scale` once.
- **Curve**: a select that writes `--mf-ease`.
- **Replay highlights**: a short pass over the success check, text swap, skeleton, error shake,
  and page slide.

Every card in the gallery carries `data-recipe="<slug>"`, so the repository check can confirm
that each recipe is shown.

## Mini projects

`mini/` holds five small apps, one per stack. Each imports five real recipes from the skill:

| Project | Stack | Recipes |
|---|---|---|
| `mini/html` | CSS + vanilla JS, no build | modal, tabs, switch, toast, success check |
| `mini/react` | React + Vite | modal, tabs, switch, toast, success check |
| `mini/vue` | Vue + Vite | modal, tabs, switch, toast, success check |
| `mini/svelte` | Svelte 5 + Vite | modal, tabs, switch, toast, success check |
| `mini/solid` | Solid + Vite | modal, tabs, switch, toast, success check |

The HTML project needs only the static server. The four framework projects carry their own
build dependencies and are never part of the installed skill.

## Screenshots and GIF

```bash
npm i -D playwright
npx playwright install chromium
npm run lint:capture
npm run lint:gif
```

`lint:capture` writes `assets/readme/demo-desktop-{light,dark}.png`,
`assets/readme/demo-mobile-{light,dark}.png`, and `assets/before-after.png`. `lint:gif` records
a short showcase with Playwright and assembles `assets/demo.gif` with ffmpeg. If Playwright is
installed somewhere else, set `PLAYWRIGHT_MODULE` to its `index.mjs`, or write that path to the
gitignored `examples/.playwright-module`.

## Smoke test

```bash
npm run lint:demo
```

Loads the page, checks the 30 cards, opens and closes the surfaces, exercises the new controls,
checks every dialog's accessible name, emulates OS-level reduced motion to prove entry surfaces
stay in place, verifies the curve control writes the token, and shows a toast. Playwright only;
the shipped skill has no dependency.

## Before / after

`before-after.html` is our own comparison page: four surfaces, what was wrong, what changed. It
is not a copy of another library's marketing page.

## Notes

- The demo uses the vanilla implementations. The React, Vue, Svelte, and Solid files in the
  skill are idiomatic ports with the same CSS and ARIA contract.
- The gallery is intentionally flat: no build step, no framework, no bundler.
