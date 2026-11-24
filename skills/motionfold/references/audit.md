# Deterministic audit

`skills/motionfold/scripts/audit.mjs` scans local files, prints findings, and never edits
anything. It uses Node built-ins only: no network, no account, no dependency.

```bash
node skills/motionfold/scripts/audit.mjs src/
node skills/motionfold/scripts/audit.mjs src/ --json
node skills/motionfold/scripts/audit.mjs src/ --min-score 80
```

## Rules

| Rule | Severity | Catches |
|---|---|---|
| `transition-all` | warn | `transition: all` |
| `layout-animation` | warn | animating `width`, `height`, `top`, `left`, `margin`, `padding` where `transform` would do |
| `hardcoded-duration` | info | literal `ms`/`s` values outside tokens |
| `inconsistent-durations` | info | more than five distinct durations in the project |
| `slow-duration` | warn | UI transitions above 600 ms; above 1 s is major |
| `missing-reduced-motion` | warn | animations or transitions with no `prefers-reduced-motion` guard |
| `untransitioned-overlay` | major | dialog/popover/toast rendered conditionally with no transition |
| `hover-without-transition` | info | a hover rule changes a property that the transition list does not cover |
| `motion-only-signal` | info | success/error/selection feedback that appears to rely on motion or color alone |
| `will-change-overuse` | info | permanent `will-change` on many elements |
| `keyboard-action-animation` | info | motion on a control named like a command palette or keyboard shortcut |

## Score

Start at 100. Subtract per finding with a per-rule cap, so one noisy rule cannot zero the
project. Grades: `smooth` (90+), `decent` (75–89), `janky` (50–74), `static` (< 50). The
score is a signal, not a product rating.

## Output

Text, grouped by file:

```text
score 82/100 — decent

src/Modal.tsx:14 — untransitioned-overlay (major)
  A <Dialog> mounts conditionally with no enter/exit transition.
  Suggest: modal. See references/recipes/modal.md.
```

`--json` for CI, `--min-score <n>` for a gate. Exit code is 0 unless the score is below the
requested minimum.

## False positives

- A CSS-in-JS value inside a plain string may be read as a duration.
- A layout animation may be intentional (accordion grid rows, tabs indicator width).
- A hover transition may be declared on a parent.
- A project may already guard reduced motion in a shared base file.
- A "command palette" component may implement intentional keyboard behavior.

When a finding is a false positive, say why and move on. The audit is a first pass; a human
review decides.

## What it cannot tell you

Whether the motion is **needed**, whether the timing feels right, or whether the interaction
is accessible in practice. Test with a keyboard and with the OS motion setting.
