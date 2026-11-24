# Contributing

Thanks for helping. The rules are short.

## Ground rules

- Keep every recipe available in **all five stacks**: vanilla, React, Vue, Svelte, Solid.
- Keep `prefers-reduced-motion` in every recipe. No exception.
- No runtime dependency. No animation library. No injected `<style>` from a component.
- Never use `transition: all`, animate layout without a documented reason, or start from
  `scale(0)`.
- Keep the manifest (`skills/motionfold/recipes.json`) as the source of truth.
- The demo imports the real implementation files, not copies.

## Change map

| Change | Files |
|---|---|
| Triggering, workflow, hard rules | `skills/motionfold/SKILL.md` |
| Decision rules, frequency gate | `skills/motionfold/references/choosing.md` |
| Tokens, one-line tuning | `skills/motionfold/references/tokens.md` |
| Reduced motion, focus, ARIA | `skills/motionfold/references/accessibility.md` |
| Framework notes, SSR, Tailwind | `skills/motionfold/references/stacks.md` |
| Audit rules and false positives | `skills/motionfold/references/audit.md` |
| Symptoms and fixes | `skills/motionfold/references/troubleshooting.md` |
| One recipe | `references/recipes/<slug>.md` + `implementations/<slug>/` |
| The recipe list | `skills/motionfold/recipes.json` |
| Demo | `examples/` |
| Screenshots and GIF | `assets/readme/`, `assets/before-after.png`, `assets/demo.gif` |
| Mini projects | `examples/mini/` |
| Evaluation prompts | `evals/evals.json` |

If you change a recipe, update its CSS, all five implementations, its reference, and the demo
entry in the same change. The repository check fails if one is missing.

## Local checks

```bash
npm run lint
npm run lint:audit-test
npm run lint:demo
npm run demo
```

For screenshots and the browser smoke test, install Playwright in `examples/` only:

```bash
npm i -D playwright
npx playwright install chromium
npm run lint:capture
npm run lint:gif
npm run lint:demo
```

## Style

- English for the product, English for the skill.
- Short imperative sentences. Tables for decisions. Checkboxes for final checks.
- A token has a documented **usage**, not just a value.
- Do not rename a project's variables when applying a recipe; add motionfold's names beside
  them.
- Keep diffs small and focused.

## Commits

Short imperative subject, conventional prefix when it helps:

```text
feat: add the success-check recipe
fix: keep the tabs indicator from animating on first paint
docs: clarify the frequency gate
chore: refresh the README captures
```
