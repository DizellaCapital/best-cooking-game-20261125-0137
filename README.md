# Kuali Panas — Warung Rush

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/DizellaCapital/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/DizellaCapital/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A complete, original cooking game — a [make.fun](https://make.fun) bounty entry by [@dizellacapital](https://make.fun/r/qxacafna). You run a small warung kitchen for one 150-second shift: orders land on the ticket board, you chop, wok-cook and plate each dish, and ring the serving bell before the customer walks out.

## How to play

Serve it as static files (no build step, no network):

```sh
node serve.ts        # or any static server rooted at game/
# open http://localhost:8080
```

- **Click an ingredient bin** (or press `1`–`7`) to take it. Chicken, chili and greens must be chopped on the board first (`C` or click the board, 3 chops); rice, noodles and egg go straight to a wok; spice goes straight to the plate.
- **Woks cook on their own** — a gold bar shows the cook. Click a wok when it says MATANG! to move the food to the plate.
- **Ring the bell** (click it, or press `Space`) when the plate matches a ticket exactly. Score is the dish price plus a patience tip, multiplied by your combo. A ticket that runs out walks away and resets the combo.
- Five dishes, three tickets at most, and the order rate rises as the shift goes on. 1200 points earns three stars.

## The game

- `game/index.html` — the page; `game/src/` is the whole game, split by job: `config.js` (menu, timings, palette), `random.js` (seeded RNG), `audio.js` (synth sounds, no audio files), `input.js` (mouse + keyboard), `world.js` (orders, chopping, woks, scoring), `render.js` (all the drawing), `shots.js` (frozen showcase scenes), `main.js` (boot + loop).
- `screenshots/` — four real renders of the game's own code: the title over a stocked kitchen, a dish mid-assembly, the service rush, and a plate ready to serve.
- `main.ts` (Node 22, stdlib only) hands the entry in: it copies `game/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library in `vendor/`.

All art is drawn in code, all sounds are synthesized in code, and every name is original — nothing is copied from a commercial game.
