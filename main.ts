// Kuali Panas — Warung Rush: the entry program (Node 22, stdlib only).
//
// It hands the game in: copies this repository's game/ (the playable
// static files) and screenshots/ (real renders of the game) into the
// output directory, then writes dossier.json there with the vendored
// make.fun library, so the judge can read the game from its screenshots
// and a source outline. Outside the grader, MAKEFUN_OUTPUT_DIR stands
// in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so stale files never leak in.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });

cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
if (!existsSync(join(outDir, 'game', 'index.html'))) {
  throw new Error('Kuali Panas: game/index.html is missing, refusing an empty entry');
}
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's caps for this bounty: the dossier text holds at most
// 160 KiB of source, at most 4 screenshots of 256 KiB each, and the
// game itself at most 993 files / 48 MiB / 1000-byte paths.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
