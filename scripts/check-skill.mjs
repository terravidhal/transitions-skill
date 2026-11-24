/**
 * Repository check for motionfold. Node built-ins only.
 *
 * Verifies the skill frontmatter, the recipe manifest, the five stack
 * implementations per recipe, the reference links, the demo coverage, the
 * JSON files, the captures, and the absence of secrets or runtime deps.
 *
 * Run with `npm run lint` (or `node scripts/check-skill.mjs`).
 */
import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const skillDir = "skills/motionfold";
const errors = [];
const warnings = [];

async function exists(relative) {
  try {
    await access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}

async function text(relative) {
  return readFile(path.join(root, relative), "utf8");
}

async function walk(relative, out = []) {
  const absolute = path.join(root, relative);
  let entries;
  try {
    entries = await readdir(absolute, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (["node_modules", ".git", "ref", ".vague", "dist", ".next", "screenshots"].includes(entry.name)) {
      continue;
    }
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) await walk(child, out);
    else out.push(child.split(path.sep).join("/"));
  }
  return out;
}

const required = [
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "package.json",
  ".github/workflows/check.yml",
  "evals/evals.json",
  `${skillDir}/SKILL.md`,
  `${skillDir}/recipes.json`,
  `${skillDir}/references/choosing.md`,
  `${skillDir}/references/tokens.md`,
  `${skillDir}/references/accessibility.md`,
  `${skillDir}/references/stacks.md`,
  `${skillDir}/references/audit.md`,
  `${skillDir}/references/troubleshooting.md`,
  `${skillDir}/implementations/_shared/motion.css`,
  `${skillDir}/implementations/_shared/presence.vanilla.js`,
  `${skillDir}/implementations/_shared/presence.react.ts`,
  `${skillDir}/implementations/_shared/presence.vue.ts`,
  `${skillDir}/implementations/_shared/presence.svelte.ts`,
  `${skillDir}/implementations/_shared/presence.solid.ts`,
  `${skillDir}/implementations/_shared/view-transition.js`,
  `${skillDir}/scripts/audit.mjs`,
  "scripts/check-skill.mjs",
  "scripts/audit-test.mjs",
  "examples/index.html",
  "examples/demo.css",
  "examples/demo.js",
  "examples/before-after.html",
  "examples/server.mjs",
  "examples/scripts/capture.mjs",
  "examples/scripts/smoke.mjs",
  "examples/README.md",
  "assets/before-after.png",
  "assets/demo.gif",
  "assets/readme/demo-desktop-light.png",
  "assets/readme/demo-desktop-dark.png",
  "assets/readme/demo-mobile-light.png",
  "assets/readme/demo-mobile-dark.png",
  "examples/mini/README.md",
  "examples/mini/shared.css",
  "examples/mini/html/index.html",
  "examples/mini/html/app.js",
  "examples/mini/html/README.md",
  "examples/mini/react/package.json",
  "examples/mini/react/index.html",
  "examples/mini/react/vite.config.js",
  "examples/mini/react/src/main.jsx",
  "examples/mini/react/src/App.jsx",
  "examples/mini/react/README.md",
  "examples/mini/vue/package.json",
  "examples/mini/vue/index.html",
  "examples/mini/vue/vite.config.js",
  "examples/mini/vue/src/main.js",
  "examples/mini/vue/src/App.vue",
  "examples/mini/vue/README.md",
  "examples/mini/svelte/package.json",
  "examples/mini/svelte/index.html",
  "examples/mini/svelte/vite.config.js",
  "examples/mini/svelte/src/main.js",
  "examples/mini/svelte/src/App.svelte",
  "examples/mini/svelte/README.md",
  "examples/mini/solid/package.json",
  "examples/mini/solid/index.html",
  "examples/mini/solid/vite.config.js",
  "examples/mini/solid/src/main.tsx",
  "examples/mini/solid/src/App.tsx",
  "examples/mini/solid/README.md",
];

const markdownFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "examples/README.md",
  `${skillDir}/SKILL.md`,
  `${skillDir}/references/choosing.md`,
  `${skillDir}/references/tokens.md`,
  `${skillDir}/references/accessibility.md`,
  `${skillDir}/references/stacks.md`,
  `${skillDir}/references/audit.md`,
  `${skillDir}/references/troubleshooting.md`,
];

for (const file of required) {
  if (!(await exists(file))) errors.push(`missing ${file}`);
}

// ── Frontmatter ───────────────────────────────────────────────────────────
const skillFile = `${skillDir}/SKILL.md`;
let skillSource = "";
if (await exists(skillFile)) {
  skillSource = await text(skillFile);
  const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    errors.push(`${skillFile} has no frontmatter`);
  } else {
    const block = frontmatter[1];
    const name = block.match(/^name:\s*(\S+)/m)?.[1];
    if (name !== "motionfold") errors.push(`${skillFile}: name must be motionfold`);
    const license = block.match(/^license:\s*(\S+)/m)?.[1];
    if (license !== "MIT") errors.push(`${skillFile}: license must be MIT`);
    if (!/^description:\s*\S/m.test(block)) {
      errors.push(`${skillFile}: description is missing`);
    }
    if (!/transition|motion|animation/i.test(block)) {
      errors.push(`${skillFile}: description should mention transitions or motion`);
    }
    if (!/reduced motion|prefers-reduced-motion/i.test(block)) {
      errors.push(`${skillFile}: description should mention reduced motion`);
    }
    if (!/React|Vue|Svelte|Solid/i.test(block)) {
      errors.push(`${skillFile}: description should mention the supported stacks`);
    }
    const description = block.replace(/^[\s\S]*?description:\s*/, "").replace(/^>-?\s*/, "");
    if (description.length < 200) {
      warnings.push(`${skillFile}: description is short; add more trigger phrases`);
    }
  }

  const referenceLinks = [...skillSource.matchAll(/\]\(references\/([^)#]+)\)/g)].map((m) => m[1]);
  for (const reference of new Set(referenceLinks)) {
    const file = `${skillDir}/references/${reference}`;
    if (!(await exists(file))) errors.push(`${skillFile} links to missing ${file}`);
  }
}

// ── Manifest ──────────────────────────────────────────────────────────────
let manifest = null;
const manifestFile = `${skillDir}/recipes.json`;
if (await exists(manifestFile)) {
  try {
    manifest = JSON.parse(await text(manifestFile));
  } catch (error) {
    errors.push(`${manifestFile}: invalid JSON (${error.message})`);
  }
}

if (manifest) {
  if (manifest.name !== "motionfold") errors.push(`${manifestFile}: name must be motionfold`);
  if (!Array.isArray(manifest.recipes)) errors.push(`${manifestFile}: recipes must be an array`);
  const slugs = new Set();
  const families = new Set(Object.keys(manifest.families ?? {}));
  const stackFiles = ["style.css", "vanilla.js", "react.tsx", "vue.vue", "svelte.svelte", "solid.tsx"];

  for (const recipe of manifest.recipes ?? []) {
    const { slug } = recipe;
    if (!slug) {
      errors.push(`${manifestFile}: a recipe has no slug`);
      continue;
    }
    if (slugs.has(slug)) errors.push(`${manifestFile}: duplicate slug ${slug}`);
    slugs.add(slug);
    if (!families.has(recipe.family)) errors.push(`${manifestFile}: ${slug} has unknown family ${recipe.family}`);
    if (recipe.demo !== slug) errors.push(`${manifestFile}: ${slug} demo should be ${slug}`);
    for (const key of ["when", "notWhen", "primitive"]) {
      if (!recipe[key]) errors.push(`${manifestFile}: ${slug} is missing ${key}`);
    }
    if (!Array.isArray(recipe.tokens) || recipe.tokens.length === 0) {
      errors.push(`${manifestFile}: ${slug} has no tokens`);
    }
    if (!Array.isArray(recipe.a11y) || recipe.a11y.length === 0) {
      errors.push(`${manifestFile}: ${slug} has no a11y contract`);
    }
    if (JSON.stringify(recipe.files) !== JSON.stringify(stackFiles)) {
      errors.push(`${manifestFile}: ${slug} files must be ${stackFiles.join(", ")}`);
    }

    const reference = `${skillDir}/references/recipes/${slug}.md`;
    if (!(await exists(reference))) errors.push(`missing recipe reference ${reference}`);

    for (const file of stackFiles) {
      const relative = `${skillDir}/implementations/${slug}/${file}`;
      if (!(await exists(relative))) {
        errors.push(`missing ${relative}`);
        continue;
      }
      const source = await text(relative);
      if (file === "style.css") {
        if (!source.includes("prefers-reduced-motion")) {
          errors.push(`${relative} has no prefers-reduced-motion guard`);
        }
        if (/transition\s*:\s*all\b/.test(source)) {
          errors.push(`${relative} uses transition: all`);
        }
        const tokens = Array.isArray(recipe.tokens) ? recipe.tokens : [];
        if (!tokens.some((token) => source.includes(token))) {
          errors.push(`${relative} does not read any of its declared tokens`);
        }
      } else {
        const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
        const allowedFrameworks = ["react", "vue", "svelte", "solid-js"];
        for (const specifier of imports) {
          if (specifier.startsWith(".") || specifier.startsWith("/")) continue;
          if (allowedFrameworks.includes(specifier)) continue;
          errors.push(`${relative} imports ${specifier}; implementations must be dependency-free`);
        }
      }
    }
  }

  if (slugs.size !== 30) warnings.push(`${manifestFile}: ${slugs.size} recipes (design targets 30)`);
}

// ── Mini projects: five real recipes each ─────────────────────────────────
const miniStacks = ["html", "react", "vue", "svelte", "solid"];
const miniRecipes = ["modal", "tabs", "switch", "toast", "success-check"];
for (const stack of miniStacks) {
  const files = await walk(`examples/mini/${stack}`);
  let source = "";
  for (const file of files) {
    if (/\.(html|js|jsx|ts|tsx|vue|svelte|md)$/.test(file)) source += `\n${await text(file)}`;
  }
  for (const slug of miniRecipes) {
    if (!source.includes(`data-mini="${slug}"`)) {
      errors.push(`examples/mini/${stack} does not use ${slug}`);
    }
  }
}

// ── Demo coverage ─────────────────────────────────────────────────────────
const demoFiles = ["examples/index.html", "examples/demo.js"];
let demoSource = "";
for (const file of demoFiles) {
  if (await exists(file)) demoSource += `\n${await text(file)}`;
}
if (manifest) {
  for (const recipe of manifest.recipes ?? []) {
    const marker = `data-recipe="${recipe.slug}"`;
    if (!demoSource.includes(marker)) errors.push(`examples/ does not demo ${recipe.slug} (${marker})`);
  }
}

// ── Package: no runtime dependencies ──────────────────────────────────────
if (await exists("package.json")) {
  try {
    const pkg = JSON.parse(await text("package.json"));
    if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
      errors.push("package.json must not declare runtime dependencies");
    }
    if (pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0) {
      warnings.push("package.json has devDependencies; keep them out of the shipped skill");
    }
  } catch (error) {
    errors.push(`package.json: invalid JSON (${error.message})`);
  }
}

// ── JSON syntax ───────────────────────────────────────────────────────────
const jsonFiles = (await walk(".")).filter((file) => file.endsWith(".json"));
for (const file of jsonFiles) {
  try {
    JSON.parse(await text(file));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
  }
}

// ── Relative links ────────────────────────────────────────────────────────
for (const file of markdownFiles) {
  if (!(await exists(file))) continue;
  const source = await text(file);
  const dir = path.dirname(file);
  const links = [...source.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]);
  for (const link of links) {
    if (link.startsWith("#")) {
      errors.push(`${file}: anchor links are not allowed (${link})`);
      continue;
    }
    if (/^(https?:|mailto:|\{)/.test(link)) continue;
    const [target] = link.split("#");
    if (!target) continue;
    const resolved = path.normalize(path.join(dir, target));
    if (!(await exists(resolved))) {
      warnings.push(`${file}: relative link not found: ${link}`);
    }
  }
}

// ── README shape ──────────────────────────────────────────────────────────
if (await exists("README.md")) {
  const readme = await text("README.md");
  if (!/^## FAQ\s*$/m.test(readme)) errors.push("README.md is missing a short FAQ section");
  if (!/npx skills add terravidhal\/motionfold/.test(readme)) {
    errors.push("README.md must show the install command near the top");
  }
}

// ── Assets ────────────────────────────────────────────────────────────────
for (const file of required.filter((entry) => entry.endsWith(".png"))) {
  if (!(await exists(file))) continue;
  const { size } = await stat(path.join(root, file));
  if (size < 10_000) errors.push(`${file} looks too small (${size} bytes)`);
}

if (await exists("assets/demo.gif")) {
  const header = (await readFile(path.join(root, "assets/demo.gif"))).subarray(0, 6).toString("ascii");
  if (header !== "GIF89a" && header !== "GIF87a") errors.push("assets/demo.gif is not a GIF");
  const { size } = await stat(path.join(root, "assets/demo.gif"));
  if (size < 50_000) errors.push(`assets/demo.gif looks too small (${size} bytes)`);
}

// ── Secrets ───────────────────────────────────────────────────────────────
const secretPatterns = [
  /sk-[A-Za-z0-9]{20,}/,
  /ghp_[A-Za-z0-9]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AIza[0-9A-Za-z_-]{30,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const textFiles = (await walk(".")).filter((file) =>
  /\.(md|json|mjs|js|ts|tsx|vue|svelte|css|html|yml|yaml)$/.test(file),
);
for (const file of textFiles) {
  const source = await text(file);
  for (const pattern of secretPatterns) {
    if (pattern.test(source)) errors.push(`${file} looks like it contains a secret`);
  }
}

// ── Audit script contract ─────────────────────────────────────────────────
if (await exists(`${skillDir}/scripts/audit.mjs`)) {
  const audit = await text(`${skillDir}/scripts/audit.mjs`);
  for (const rule of [
    "transition-all",
    "layout-animation",
    "missing-reduced-motion",
    "slow-duration",
    "untransitioned-overlay",
    "inconsistent-durations",
  ]) {
    if (!audit.includes(rule)) errors.push(`${skillDir}/scripts/audit.mjs is missing rule ${rule}`);
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}

const recipeCount = manifest?.recipes?.length ?? 0;
console.log(
  `ok: motionfold skill, ${recipeCount} recipes, 6 implementations each, references, links, JSON, assets`,
);
