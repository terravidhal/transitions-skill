# Examples — the live demo

A zero-build gallery of the fourteen recipes, importing the real implementations from
`../skills/motionfold/`.

## Run it

```bash
npm run demo
```

Open <http://localhost:4173/examples/index.html>. The server is `server.mjs`, a tiny static
server with no dependency.

## What you can change

- **Theme**: light and dark, applied to the whole page.
- **Motion**: `Auto` (follow the OS), `Reduced`, or `Full` via `data-motion`.
- **Speed**: a 0.5×–1.5× slider that writes `--mf-scale` once.
- **Curve**: a select that writes `--mf-ease`.
- **Replay highlights**: a short pass over the success check, text swap, skeleton, error shake,
  and page slide.

Every card in the gallery carries `data-recipe="<slug>"`, so the repository check can confirm
that each recipe is shown.

## Screenshots

```bash
npm i -D playwright
npx playwright install chromium
npm run lint:capture
```

Writes `assets/readme/demo-desktop-{light,dark}.png`,
`assets/readme/demo-mobile-{light,dark}.png`, and `assets/before-after.png`. If Playwright is
installed somewhere else, set `PLAYWRIGHT_MODULE` to its `index.mjs`.

## Smoke test

```bash
npm run lint:demo
```

Loads the page, checks the 14 cards, opens and closes the modal with Escape, forces reduced
motion, verifies the curve control writes the token, and shows a toast. Playwright only; the
shipped skill has no dependency.

## Before / after

`before-after.html` is our own comparison page: four surfaces, what was wrong, what changed.
It is not a copy of another library's marketing page.

## Notes

- The demo uses the vanilla implementations. The React, Vue, Svelte, and Solid files in the
  skill are idiomatic ports with the same CSS and ARIA contract.
- The gallery is intentionally flat: no build step, no framework, no bundler.
