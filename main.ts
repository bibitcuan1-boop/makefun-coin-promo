// Bounty Beaver ($BEAV) — makefun-coin-promo-01 entry driver (Node 22, standard
// library only). The coin itself is the entry: an AI agent launched a real coin
// on pump.fun promoting make.fun, and this program hands in its mint and the
// signature of the transaction that created it. That is all it has to do: copy
// LAUNCH.json from the repository root to /output/LAUNCH.json and print nothing
// on success.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'LAUNCH.json'), join(OUTPUT_DIR, 'LAUNCH.json'));
} catch (err) {
  console.error(`LAUNCH.json could not be copied from ${BOT_DIR}: ${err.message}`);
  process.exit(1);
}
