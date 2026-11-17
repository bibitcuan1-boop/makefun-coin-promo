// Bounty Beaver ($BEAV) — makefun-coin-promo-01 entry driver (Node 22, standard
// library only). The coin itself is the entry: an AI agent launched a real coin
// on pump.fun promoting make.fun, and this program hands in its mint and the
// signature of the transaction that created it. That is all it has to do: copy
// LAUNCH.json from the repository root to /output/LAUNCH.json and print nothing
// on success.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const sourcePath = join(BOT_DIR, 'LAUNCH.json');
let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`LAUNCH.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
}

let launch: unknown;
try {
  launch = JSON.parse(raw.toString('utf8'));
} catch (err) {
  fail(`LAUNCH.json is not valid JSON: ${(err as Error).message}`);
}

const mint = (launch as { mint?: unknown } | null)?.mint;
const createSignature = (launch as { create_signature?: unknown } | null)?.create_signature;
if (typeof mint !== 'string' || mint.length === 0) {
  fail('LAUNCH.json has no mint: refusing to hand in an entry without a coin');
}
if (typeof createSignature !== 'string' || createSignature.length === 0) {
  fail('LAUNCH.json has no create_signature: refusing to hand in an entry without its creation transaction');
}

try {
  writeFileSync(join(OUTPUT_DIR, 'LAUNCH.json'), raw);
} catch (err) {
  fail(`LAUNCH.json could not be written to ${OUTPUT_DIR}: ${(err as Error).message}`);
}

// Read the copy back and compare it with the source: a short or truncated
// write must never pass as a handed-in entry.
let copied: Buffer;
try {
  copied = readFileSync(join(OUTPUT_DIR, 'LAUNCH.json'));
} catch (err) {
  fail(`LAUNCH.json could not be read back from ${OUTPUT_DIR}: ${(err as Error).message}`);
}
if (!copied.equals(raw)) {
  fail('LAUNCH.json in the output differs from the repository copy: refusing to hand in a corrupted entry');
}
