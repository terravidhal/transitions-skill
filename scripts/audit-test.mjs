/**
 * Fixtures for the deterministic audit. No dependencies, no writes.
 * Run with `npm run lint:audit-test`.
 */
import { runAudit } from "../skills/motionfold/scripts/audit.mjs";

const cases = [
  {
    name: "clean component",
    files: [
      {
        path: "src/Modal.css",
        ext: ".css",
        content: `
          .modal { transition: opacity var(--mf-modal-duration) var(--mf-modal-ease), transform var(--mf-modal-duration) var(--mf-modal-ease); }
          @media (prefers-reduced-motion: reduce) { .modal { transition: none; } }
        `,
      },
    ],
    expect: [],
    maxScore: 100,
    minScore: 100,
  },
  {
    name: "transition all",
    files: [{ path: "src/a.css", ext: ".css", content: ".a { transition: all 200ms ease; }" }],
    expect: ["transition-all"],
  },
  {
    name: "layout animation",
    files: [{ path: "src/b.css", ext: ".css", content: ".b { transition: height 240ms ease, opacity 240ms; }" }],
    expect: ["layout-animation"],
  },
  {
    name: "missing reduced motion",
    files: [{ path: "src/c.css", ext: ".css", content: "@keyframes pop { to { transform: scale(1.04); } } .c { animation: pop 300ms; }" }],
    expect: ["missing-reduced-motion"],
  },
  {
    name: "slow duration",
    files: [{ path: "src/d.css", ext: ".css", content: ".d { transition: opacity 1400ms ease; }" }],
    expect: ["slow-duration"],
  },
  {
    name: "hardcoded durations",
    files: [
      {
        path: "src/e.css",
        ext: ".css",
        content: ".e { transition: opacity 170ms ease; } .f { transition: opacity 230ms ease; }",
      },
    ],
    expect: ["hardcoded-duration"],
  },
  {
    name: "untransitioned overlay",
    files: [
      {
        path: "src/Panel.tsx",
        ext: ".tsx",
        content: "export function Panel({ open }) { return open && <Dialog>Hello</Dialog>; }",
      },
    ],
    expect: ["untransitioned-overlay"],
  },
  {
    name: "inconsistent durations",
    files: [
      {
        path: "src/g.css",
        ext: ".css",
        content: ".g { transition: opacity 111ms; } .h { transition: opacity 222ms; } .i { transition: opacity 333ms; } .j { transition: opacity 444ms; } .k { transition: opacity 555ms; } .l { transition: opacity 666ms; }",
      },
    ],
    expect: ["inconsistent-durations"],
  },
];

let failed = 0;
for (const testCase of cases) {
  const result = runAudit(testCase.files);
  const rules = new Set(result.findings.map((finding) => finding.rule));
  const missing = testCase.expect.filter((rule) => !rules.has(rule));
  if (missing.length > 0) {
    failed++;
    console.error(`FAIL ${testCase.name}: missing ${missing.join(", ")} (got ${[...rules].join(", ") || "none"})`);
  } else if (testCase.minScore !== undefined && result.score < testCase.minScore) {
    failed++;
    console.error(`FAIL ${testCase.name}: score ${result.score} < ${testCase.minScore}`);
  } else {
    console.log(`ok ${testCase.name} — ${result.score}/100`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} audit test(s) failed`);
  process.exit(1);
}
console.log(`\nok: ${cases.length} audit fixtures`);
