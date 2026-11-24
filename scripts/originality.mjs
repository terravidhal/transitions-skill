/**
 * Originality check for motionfold.
 *
 * The reference checkout lives in ref/ and is gitignored. When it is present,
 * compare every shipped text file with it:
 *   - no file may be byte-identical to a reference file;
 *   - no 30-token sequence may appear in both trees.
 *
 * When ref/ is absent (CI, a clean clone), the check reports that it skipped.
 * Run with `npm run lint:originality`.
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const refDir = path.join(root, "ref");
const extensions = /\.(md|html|css|js|mjs|ts|tsx|vue|svelte|txt)$/;
const skip = new Set([".git", "node_modules", "ref", ".vague", "assets", "screenshots", ".demo-frames"]);
const shingleSize = 30;
const errors = [];

async function exists(target) {
  try {
    const entries = await readdir(target);
    return entries.length >= 0;
  } catch {
    return false;
  }
}

async function walk(absolute, out = []) {
  let entries;
  try {
    entries = await readdir(absolute, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) await walk(child, out);
    else if (extensions.test(entry.name)) out.push(child);
  }
  return out;
}

function tokens(source) {
  return source
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#>|~]+/g, " ")
    .toLowerCase()
    .match(/[a-z0-9]+/g) ?? [];
}

function shingles(list) {
  const out = new Map();
  for (let index = 0; index + shingleSize <= list.length; index += 1) {
    const key = list.slice(index, index + shingleSize).join(" ");
    if (!out.has(key)) out.set(key, index);
  }
  return out;
}

function relative(absolute) {
  return path.relative(root, absolute).split(path.sep).join("/");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  if (!(await exists(refDir))) {
    console.log("ok: ref/ is absent, originality comparison skipped");
    return;
  }

  const [ours, refs] = await Promise.all([walk(root), walk(refDir)]);
  const refHashes = new Map();
  const refShingles = new Map();

  for (const file of refs) {
    const buffer = await readFile(file);
    refHashes.set(sha256(buffer), relative(file));
    const list = tokens(buffer.toString("utf8"));
    if (list.length < shingleSize) continue;
    for (const [key, index] of shingles(list)) {
      if (!refShingles.has(key)) refShingles.set(key, { file: relative(file), index });
    }
  }

  for (const file of ours) {
    if (file.startsWith(refDir + path.sep)) continue;
    const buffer = await readFile(file);
    const name = relative(file);
    const digest = sha256(buffer);
    if (refHashes.has(digest)) {
      errors.push(`${name} is byte-identical to ${refHashes.get(digest)}`);
      continue;
    }
    const list = tokens(buffer.toString("utf8"));
    if (list.length < shingleSize) continue;
    for (const [key, index] of shingles(list)) {
      const match = refShingles.get(key);
      if (!match) continue;
      const snippet = key.split(" ").slice(0, 10).join(" ");
      errors.push(`${name}:${index} shares ${shingleSize} tokens with ${match.file}: ${snippet}…`);
      break;
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`);
    console.error(`\n${errors.length} originality error(s)`);
    process.exit(1);
  }

  console.log(`ok: originality, ${ours.length} files compared with ${refs.length} reference files`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
