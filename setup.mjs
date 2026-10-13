#!/usr/bin/env node
/**
 * First-run setup for the Grovia starter.
 *
 *   node setup.mjs          interactive
 *   node setup.mjs --yes    accept every default (CI, scripted installs)
 *
 * 1. Checks Node.js (Next.js 16 needs 20.9 or newer)
 * 2. Makes sure pnpm is available
 * 3. Installs every workspace with one `pnpm install`
 * 4. Creates the root .env from _.env.example if there is none
 * 5. Asks for MONGO_URI and replaces a placeholder JWT_SECRET with a random one
 *
 * It never overwrites a value you already set, and never prints a secret.
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(ROOT, ".env");
/* `_.env.example` first; `.env.example` still works for anyone who renamed it. */
const TEMPLATES = ["_.env.example", ".env.example"].map((name) => path.join(ROOT, name));
const MIN_NODE = [20, 9];
const ASSUME_YES = process.argv.includes("--yes") || process.argv.includes("-y");
const IS_WINDOWS = process.platform === "win32";

const say = (message = "") => stdout.write(`${message}\n`);
const step = (message) => say(`\n▸ ${message}`);

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit", shell: IS_WINDOWS });
  return result.status === 0;
}

function has(bin) {
  const probe = spawnSync(IS_WINDOWS ? "where" : "which", [bin], { encoding: "utf8", shell: IS_WINDOWS });
  return probe.status === 0;
}

function readEnv(filePath) {
  const values = {};
  if (!fs.existsSync(filePath)) return values;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return values;
}

function writeEnv(filePath, updates) {
  let source = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(updates)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    source = pattern.test(source)
      ? source.replace(pattern, `${key}=${value}`)
      : `${source.replace(/\n?$/, "\n")}${key}=${value}\n`;
  }
  fs.writeFileSync(filePath, source);
}

const isPlaceholder = (value) => !value || /change-me|changeme|your-/i.test(value);

async function main() {
  say("Grovia starter setup");
  say("Installs the workspace and writes your root .env.");

  step("Checking Node.js");
  const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
  if (major < MIN_NODE[0] || (major === MIN_NODE[0] && minor < MIN_NODE[1])) {
    say(`  Node.js ${MIN_NODE.join(".")}+ is required, and you have ${process.versions.node}.`);
    say("  Install Node 22 (see .nvmrc) and run this again.");
    process.exit(1);
  }
  say(`  Node.js ${process.versions.node}`);

  step("Checking pnpm");
  if (!has("pnpm")) {
    say("  pnpm not found. Enabling it through Corepack, which ships with Node…");
    if (!run("corepack", ["enable", "pnpm"]) || !has("pnpm")) {
      say("  Could not enable pnpm. Run `npm install -g pnpm@11` and try again.");
      process.exit(1);
    }
  }
  say("  pnpm is available");

  step("Installing dependencies (pnpm install)");
  if (!run("pnpm", ["install"])) {
    say("  pnpm install failed. Fix the error above, then run `node setup.mjs` again.");
    process.exit(1);
  }

  step("Writing the root .env");
  if (fs.existsSync(ENV_PATH)) {
    say("  Found an existing .env. It is kept; only placeholders are filled in.");
  } else {
    const template = TEMPLATES.find((candidate) => fs.existsSync(candidate));
    if (!template) {
      say("  _.env.example is missing, so .env cannot be created.");
      process.exit(1);
    }
    fs.copyFileSync(template, ENV_PATH);
    say(`  Created .env from ${path.basename(template)}`);
  }

  const env = readEnv(ENV_PATH);
  const updates = {};
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    if (!ASSUME_YES) {
      const current = env.MONGO_URI || "mongodb://127.0.0.1:27017/grovia";
      const shown = current.includes("@") ? "(your saved connection string)" : current;
      const answer = (await rl.question(`  MongoDB connection string [Enter keeps ${shown}]: `)).trim();
      if (answer) updates.MONGO_URI = answer;
      else if (!env.MONGO_URI) updates.MONGO_URI = current;
    }
  } finally {
    rl.close();
  }

  if (isPlaceholder(env.JWT_SECRET)) {
    updates.JWT_SECRET = crypto.randomBytes(32).toString("base64");
    say("  Generated a random JWT_SECRET");
  }

  if (Object.keys(updates).length > 0) {
    writeEnv(ENV_PATH, updates);
    say("  Saved .env (git ignores it)");
  }

  step("Done. Start all three apps with:");
  say("  pnpm run dev");
  say();
  say("  Storefront   http://localhost:3000");
  say("  Dashboard    http://localhost:3001");
  say("  API health   http://localhost:8000/api/health");
}

main().catch((error) => {
  say(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
