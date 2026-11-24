# RAPPORT — motionfold

> État local du dépôt au 2026-11-24. Rien n'a été poussé ni publié. Aucun secret, aucune
> télémétrie, aucun service. Produit en anglais ; ce rapport interne est en français.

## 1. Ce qui est livré

- **Skill installable** : `skills/motionfold/SKILL.md` (frontmatter `name`, `description` de
  déclenchement, `license: MIT`), `recipes.json` comme source de vérité, six références
  générales et trente références de recettes.
- **Trente recettes** : les quatorze de la v1 (modal, drawer, popover, tooltip, toast,
  accordion, tabs, switch, checkbox, skeleton, success-check, error-shake, text-swap,
  page-slide) plus bottom-sheet, command-palette, banner, lightbox, dropdown, radio-group,
  segmented-control, icon-swap, like-button, copy-button, spinner-to-check, number-pop,
  progress-bar, stepper, theme-reveal, inline-edit.
- **Cinq stacks par recette** : CSS + `vanilla.js`, `react.tsx`, `vue.vue`, `svelte.svelte`,
  `solid.tsx`. Mêmes classes `mf-*`, mêmes tokens, même contrat ARIA.
- **Couche de mouvement partagée** : `motion.css` (échelle, distances, blur, tokens de
  recette, override `data-motion`) et helpers de présence par stack.
- **Accessibilité par défaut** : bloc littéral `prefers-reduced-motion` dans chaque CSS,
  primitives natives (`<dialog>`, Popover API, View Transitions), focus, `inert`, régions
  live, `role` et `aria-*`.
- **Réglage en une ligne** : `--mf-scale`, `--mf-ease`, ou un token de recette ; les props
  des composants écrivent seulement ces variables.
- **Audit déterministe** : `skills/motionfold/scripts/audit.mjs`, sans dépendance, lecture
  seule, score et suggestions, `--json` et `--min-score`.
- **Démo réelle** : `examples/index.html` importe les vrais fichiers vanilla, avec thème,
  mouvement auto/réduit/complet, vitesse, courbe, replay, et les trente cartes.
- **Mini projets par stack** : `examples/mini/{html,react,vue,svelte,solid}` importent chacun
  cinq vraies recettes (modal, tabs, switch, toast, success-check).
- **Avant/après original** : `examples/before-after.html`, fabriqué pour ce dépôt.
- **Captures Playwright Chromium** : desktop 1440, mobile 390, clair/sombre, plus l'avant/après
  et un GIF de démonstration `assets/demo.gif` assemblé avec ffmpeg.
- **Qualité** : `scripts/check-skill.mjs`, fixtures d'audit, smoke test navigateur, evals,
  workflow GitHub Actions.

## 2. Vérifications exécutées

| Commande | Résultat |
|---|---|
| `npm run lint` | OK — frontmatter, manifeste, 30 recettes × 6 fichiers, références, mini projets, liens, JSON, assets, GIF, secrets |
| `npm run lint:audit-test` | OK — 8 fixtures, règles attendues |
| `npm run lint:demo` | OK — 30 cartes, toutes les interactions, mouvement réduit, réglage, toast |
| `npm run lint:capture` | OK — 5 captures générées dans `assets/` |
| `npm run lint:gif` | OK — `assets/demo.gif` généré avec Playwright + ffmpeg |

Le smoke test a réellement ouvert/fermé modal et drawer avec Escape, ouvert le popover,
affiché le tooltip, plié/déplié l'accordéon, changé d'onglet, basculé switch et checkbox,
révélé/réinitialisé le skeleton, déclenché succès et erreur, changé le texte, navigué
liste ↔ détail, changé de thème, forcé le mouvement réduit, écrit `--mf-ease`, et affiché un
toast — sans erreur console.

## 3. Décisions techniques

1. **Primitives natives d'abord.** Modal et drawer utilisent `<dialog>` + `showModal()` :
   focus trap, Escape, top layer et retour du focus sont gratuits. Le popover utilise
   l'API Popover pour le light dismiss. La navigation utilise `startViewTransition` avec un
   fallback instantané.
2. **Entrée/sortie par `@starting-style` et `transition-behavior: allow-discrete`.** Pour les
   surfaces natives, appeler `close()` anime la sortie sans `setTimeout` qui devine la durée.
3. **Sortie plus rapide que l'entrée** partout, sauf tabs et accordéon (symétriques,
   documentés).
4. **Un seul fichier de tokens.** Pas de CSS injecté par les composants, pas de duplication
   des tokens dans chaque stack.
5. **Cycle de présence robuste** pour toast et skeleton : `transitionend` + fallback, test de
   la préférence de mouvement, interruption gérée.
6. **Audit par usage**, pas par nombre : le script signale une durée littérale ou une
   animation de layout, et suggère la recette ou le token qui correspond à l'intention.
7. **Zéro dépendance runtime.** Les fichiers React/Vue/Svelte/Solid n'importent que leur
   framework. Playwright n'est utilisé que pour les captures et le smoke test, jamais livré.

## 4. Ce qui distingue le dépôt de la référence

- Licence **MIT**, code, textes et assets originaux ; aucune recette, aucun texte, aucune
  capture de `transitions.dev` n'est copiée.
- **Cinq stacks** avec le même contrat, pas seulement CSS + React, plus un mini projet
  exécutable par stack.
- **A11y par défaut** : guard dans chaque recette, override applicatif, primitives natives,
  checklist par recette.
- **Réglage en une ligne** réellement testé par la démo et le smoke test.
- **Audit local, libre, sans compte ni service hébergé.**
- **Page de démo auto-hébergeable**, sans build, qui importe les fichiers livrés.
- **Périmètre curé** de 30 recettes produit, avec règles d'exclusion et gate de fréquence.

## 5. Limites connues

- Les fichiers React, Vue, Svelte et Solid ne sont pas compilés dans ce dépôt : aucun
  harnais Vite n'a été ajouté, pour éviter des dépendances de développement lourdes. Le
  validateur prouve leur présence, leurs imports autorisés, leurs tokens et leur parité de
  contrat ; un build multi-framework reste à ajouter si le dépôt grandit.
- Le positionnement du popover dans la démo est un helper viewport-aware, pas un moteur de
  collision complet. En projet réel, réutiliser Radix, Floating UI ou CSS anchor positioning.
- `<dialog>`, Popover API, `@starting-style` et View Transitions exigent des navigateurs
  récents. Le CSS et les helpers prévoient un comportement instantané en fallback ; le
  pixel-perfect entre navigateurs n'est pas promis.
- Les captures sont générées avec le Chromium disponible localement ; les régénérer avec
  `npm run lint:capture` après une modification visuelle.

## 6. Reste à faire côté propriétaire

1. Créer le dépôt GitHub `terravidhal/motionfold`.
2. Pousser les commits locaux (aucun push n'a été fait).
3. Vérifier `npx skills add terravidhal/motionfold` depuis un projet neuf.
4. Optionnel : publier une release `v0.1.0` et ajouter un harnais de build cinq stacks.
