#!/usr/bin/env node
/**
 * motionfold audit — deterministic, local, read-only.
 * Node built-ins only: no network, no dependency, no writes.
 *
 *   node skills/motionfold/scripts/audit.mjs [path]
 *   node skills/motionfold/scripts/audit.mjs [path] --json
 *   node skills/motionfold/scripts/audit.mjs [path] --min-score 80
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", "ref", ".vague", "screenshots"]);
const STYLE_EXT = new Set([".css", ".scss", ".less"]);
const CODE_EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".vue", ".svelte", ".html"]);
const ALL_EXT = new Set([...STYLE_EXT, ...CODE_EXT]);

const SEVERITY_WEIGHT = { major: 18, warn: 7, info: 2 };
const RULE_CAP = 30;

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === "\n") line++;
  }
  return line;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (match, prefix) => prefix + " ".repeat(match.length - prefix.length));
}

function toMs(number, unit) {
  return unit === "s" ? Number.parseFloat(number) * 1000 : Number.parseFloat(number);
}

function distinctNumbers(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}

const LAYOUT_PROPERTIES = /\b(width|height|top|left|right|bottom|margin|padding|inset)\b/;

/**
 * files: [{ path, ext, content }]
 * returns { score, grade, findings: [{ rule, severity, path, line, message, suggestion }] }
 */
export function runAudit(files) {
  const findings = [];
  const durations = [];
  let animations = false;
  let reducedGuard = false;
  let willChangeCount = 0;

  for (const file of files) {
    if (!ALL_EXT.has(file.ext)) continue;
    const source = stripComments(file.content);
    const isStyle = STYLE_EXT.has(file.ext);

    if (/prefers-reduced-motion/.test(source)) reducedGuard = true;
    if (/@keyframes|\banimation(?:-name)?\s*:/.test(source)) animations = true;

    // transition: all
    for (const match of source.matchAll(/transition\s*:\s*all\b/g)) {
      findings.push({
        rule: "transition-all",
        severity: "warn",
        path: file.path,
        line: lineOf(source, match.index ?? 0),
        message: 'Found "transition: all"; it animates every property, including layout.',
        suggestion: "Name the properties the state changes (transform, opacity, background-color).",
      });
    }

    // layout animation
    for (const match of source.matchAll(/\btransition(?:-property)?\s*:\s*([^;}]+)/g)) {
      const value = match[1];
      if (LAYOUT_PROPERTIES.test(value) && !/grid-template-rows|max-height/.test(value)) {
        findings.push({
          rule: "layout-animation",
          severity: "warn",
          path: file.path,
          line: lineOf(source, match.index ?? 0),
          message: `Transition touches a layout property: ${value.trim().slice(0, 70)}.`,
          suggestion: "Use transform/opacity. Keep layout animation only for grid rows or a measured indicator, and document it.",
        });
      }
    }

    // literal durations
    for (const match of source.matchAll(/\b(?:transition|animation)(?:-duration)?\s*:\s*([^;}]+)/g)) {
      const value = match[1];
      const hasTime = /\b\d*\.?\d+m?s\b/.test(value);
      if (!hasTime) continue;
      for (const time of value.matchAll(/\b(\d*\.?\d+)(ms|s)\b/g)) {
        const ms = toMs(time[1], time[2]);
        if (ms <= 20) continue;
        durations.push(ms);
        if (!/var\(/.test(value)) {
          findings.push({
            rule: "hardcoded-duration",
            severity: "info",
            path: file.path,
            line: lineOf(source, match.index ?? 0),
            message: `Literal duration ${time[0]} in a transition/animation.`,
            suggestion: "Reference a motion token (--mf-duration-* or a recipe token) so the app moves as one.",
          });
        }
        if (ms > 600) {
          findings.push({
            rule: "slow-duration",
            severity: ms > 1000 ? "major" : "warn",
            path: file.path,
            line: lineOf(source, match.index ?? 0),
            message: `Transition or animation runs ${ms}ms.`,
            suggestion: "UI transitions should stay well under a second; 150–400ms covers most recipes.",
          });
        }
      }
    }

    // untransitioned overlay (code files)
    if (!isStyle) {
      const overlay = source.match(/<(Modal|Dialog|Drawer|Sheet|Popover|Tooltip|Toast|Snackbar|Dropdown|DropdownMenu|Menu)\b/);
      const conditional =
        /\{\s*\w[\w.]*\s*&&\s*</.test(source) ||
        /\b(?:open|isOpen|show\w*)\s*(?:&&|\?)/.test(source) ||
        /\bopen\s*[=?]/.test(source) ||
        /\bisOpen\b/.test(source);
      const animated =
        /(transition|animate|@keyframes|data-mf-state|data-state|data-open|aria-expanded|showModal|showPopover|startViewTransition)/i.test(
          source,
        );
      if (overlay && conditional && !animated) {
        findings.push({
          rule: "untransitioned-overlay",
          severity: "major",
          path: file.path,
          line: lineOf(source, overlay.index ?? 0),
          message: `<${overlay[1]}> appears and disappears with no enter/exit path.`,
          suggestion: "Use the matching recipe (modal, drawer, popover, toast, tooltip) so it animates instead of popping.",
        });
      }
    }

    // hover changes without a transition
    for (const match of source.matchAll(/[^{}]*:hover[^{}]*\{([^}]*)\}/g)) {
      const body = match[1];
      if (/\b(transform|opacity|color|background|border|box-shadow)\b/.test(body) && !/transition/.test(source)) {
        findings.push({
          rule: "hover-without-transition",
          severity: "info",
          path: file.path,
          line: lineOf(source, match.index ?? 0),
          message: "A hover state changes a visual property but no transition is declared.",
          suggestion: "Add a short transition on the property that changes, or accept the snap intentionally.",
        });
        break;
      }
    }

    // motion-only signal (heuristic)
    if (/(success|check|error|invalid)/i.test(source) && /(animation|@keyframes|transition)/i.test(source)) {
      const hasText = /(role=["'](status|alert)["']|aria-live|textContent|<p|<span[^>]*>[^<{]{2,})/i.test(source);
      if (!hasText) {
        findings.push({
          rule: "motion-only-signal",
          severity: "info",
          path: file.path,
          line: 1,
          message: "Success/error motion without visible text or a live region.",
          suggestion: "Add visible text and role=status/alert; motion must not be the only signal.",
        });
      }
    }

    // will-change overuse
    for (const _ of source.matchAll(/will-change\s*:/g)) willChangeCount++;
    if (willChangeCount > 12) {
      findings.push({
        rule: "will-change-overuse",
        severity: "info",
        path: "(project)",
        line: 0,
        message: `${willChangeCount} permanent will-change declarations.`,
        suggestion: "Apply will-change only while a transition runs, then remove it.",
      });
      willChangeCount = 0;
    }

    // keyboard-heavy animation (heuristic)
    if (/command|palette|shortcut|keyboard/i.test(file.path) && /(animation|@keyframes)/i.test(source)) {
      findings.push({
        rule: "keyboard-action-animation",
        severity: "info",
        path: file.path,
        line: 1,
        message: "A keyboard-heavy surface animates. Repetition turns motion into latency.",
        suggestion: "Use no animation or a one-frame opacity change for actions used hundreds of times a day.",
      });
    }
  }

  if (animations && !reducedGuard) {
    findings.push({
      rule: "missing-reduced-motion",
      severity: "warn",
      path: "(project)",
      line: 0,
      message: "The project animates but never checks prefers-reduced-motion.",
      suggestion: "Add a guard that removes displacement, scale, and blur (keep a short opacity change).",
    });
  }

  const unique = distinctNumbers(durations).filter((ms) => ![80, 150, 240, 360, 500].includes(ms));
  if (unique.length > 5) {
    findings.push({
      rule: "inconsistent-durations",
      severity: "info",
      path: "(project)",
      line: 0,
      message: `${unique.length} distinct durations outside the token scale: ${unique.slice(0, 8).join(", ")}${unique.length > 8 ? ", …" : ""}ms.`,
      suggestion: "Consolidate onto two or three duration tokens.",
    });
  }

  const perRule = new Map();
  for (const finding of findings) {
    const current = perRule.get(finding.rule) ?? 0;
    perRule.set(finding.rule, Math.min(RULE_CAP, current + (SEVERITY_WEIGHT[finding.severity] ?? 2)));
  }
  const penalty = [...perRule.values()].reduce((sum, value) => sum + value, 0);
  const score = Math.max(0, 100 - penalty);
  const grade = score >= 90 ? "smooth" : score >= 75 ? "decent" : score >= 50 ? "janky" : "static";

  findings.sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line);
  return { score, grade, findings };
}

async function walk(root, out = []) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      if (entry.name !== ".github") continue;
    }
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (ALL_EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

export async function collectFiles(root) {
  const info = await stat(root).catch(() => null);
  const paths = info?.isDirectory() ? await walk(root) : [root];
  const files = [];
  for (const filePath of paths) {
    const content = await readFile(filePath, "utf8").catch(() => "");
    if (!content) continue;
    files.push({ path: filePath, ext: path.extname(filePath), content });
  }
  return files;
}

export function formatText(result) {
  const lines = [`score ${result.score}/100 — ${result.grade}`, ""];
  if (result.findings.length === 0) {
    lines.push("No findings.");
    return lines.join("\n");
  }
  let current = null;
  for (const finding of result.findings) {
    if (finding.path !== current) {
      current = finding.path;
      lines.push(current === "(project)" ? "(project)" : `${current}`);
    }
    lines.push(`  :${finding.line} — ${finding.rule} (${finding.severity})`);
    lines.push(`    ${finding.message}`);
    if (finding.suggestion) lines.push(`    → ${finding.suggestion}`);
  }
  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const minIndex = args.indexOf("--min-score");
  const minScore = minIndex === -1 ? 0 : Number.parseFloat(args[minIndex + 1] ?? "0");
  const target = args.find((arg) => !arg.startsWith("--") && arg !== String(minScore)) ?? ".";

  const files = await collectFiles(target);
  const result = runAudit(files);

  if (json) console.log(JSON.stringify(result, null, 2));
  else console.log(formatText(result));

  if (result.score < minScore) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
