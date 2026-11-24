# Mini projects

Five small apps, one per stack. Each one imports **five real recipes** from
`skills/motionfold/implementations/` and nothing else:

| Project | Stack | Recipes |
|---|---|---|
| `html/` | CSS + vanilla JS, no build | modal, tabs, switch, toast, success check |
| `react/` | React + Vite | modal, tabs, switch, toast, success check |
| `vue/` | Vue + Vite | modal, tabs, switch, toast, success check |
| `svelte/` | Svelte 5 + Vite | modal, tabs, switch, toast, success check |
| `solid/` | Solid + Vite | modal, tabs, switch, toast, success check |

The HTML project needs no install; serve the repository root and open
`examples/mini/html/`. The four framework projects carry only their own build dependencies. Those
dependencies are **not** part of the shipped skill: `npx skills add` copies the skill folder, not
these examples.

```bash
cd examples/mini/react   # or vue, svelte, solid
npm install
npm run dev
```

Each page exposes `data-mini="<recipe>"` markers so the checks can confirm the five recipes are
present.
