// Spotlight @crisxai5 entry for make.fun (Node 22, standard library only).
//
// What this program does: it hands the gate the address of the X post that
// is the entry. POST.json at the repository root names the post; the program
// copies it to /output/POST.json. The house reads the post's public counts
// through FxTwitter and ranks it on likes + reposts + quotes. Nothing else
// this program writes is scored.
//
// Local run (outside the grader's container, MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveDirs(): { botDir: string; outputDir: string } {
  return {
    botDir: process.env.MAKEFUN_BOT_DIR ?? '/bot',
    outputDir: process.env.MAKEFUN_OUTPUT_DIR ?? '/output',
  };
}

function main(): void {
  const { botDir, outputDir } = resolveDirs();
  const source = resolve(botDir, 'POST.json');
  const target = resolve(outputDir, 'POST.json');

  if (!existsSync(source)) {
    console.error(`POST.json not found at ${source}`);
    process.exit(1);
  }

  // Validate that the file is a JSON object with a url string before copying,
  // so a malformed POST.json fails loudly here instead of at the gate.
  const parsed: unknown = JSON.parse(readFileSync(source, 'utf8'));
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== 'string'
  ) {
    console.error('POST.json must be a JSON object with a "url" string');
    process.exit(1);
  }

  mkdirSync(outputDir, { recursive: true });
  copyFileSync(source, target);
  console.log(`POST.json copied to ${target}`);
}

main();
