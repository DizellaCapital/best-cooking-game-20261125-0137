// Deterministic showcase scenes for screenshots (?shot=start|play|rush|serve).
// Each builds a fixed, lively mid-game state so the screenshots show the
// kitchen, the order board, ingredients on the counter, a dish mid-assembly,
// the timer and a plate ready to serve — without playing.
import { DISH_BY_ID } from './config.js';
import { addSteam, addPopup } from './world.js';

function order(world, dishId, patienceFrac) {
  const dish = DISH_BY_ID[dishId];
  const patience = 45 * patienceFrac;
  world.orders.push({
    id: `shot-${dishId}`,
    dishId,
    patience,
    maxPatience: 45,
    bornAt: 0,
    instant: true,
  });
}

export function applyShot(world, name) {
  world.phase = 'play';
  world.elapsed = 0;
  world.particles = [];
  world.popups = [];

  if (name === 'start') {
    // Title screen over a stocked kitchen: two orders waiting, bins full.
    world.phase = 'title';
    world.best = 860;
    order(world, 'nasgor', 0.8);
    order(world, 'mieayam', 0.65);
    return;
  }

  if (name === 'play') {
    // Mid-assembly: one wok cooking, one item chopped, plate half built.
    world.elapsed = 38;
    world.timeLeft = 112;
    world.score = 340;
    world.coins = 220;
    world.combo = 2;
    world.served = 3;
    order(world, 'nasgor', 0.62);
    order(world, 'soto', 0.8);
    world.woks[0] = { item: 'ayam', progress: 0.55, cooked: false };
    world.board = { item: 'cabai', clicks: 2, done: false };
    world.plate = ['nasi', 'telur'];
    addSteam(world, 452, 170, 4);
    addSteam(world, 712, 170, 2);
    return;
  }

  if (name === 'rush') {
    // Service rush: three tickets, one about to walk out, combo burning.
    world.elapsed = 118;
    world.timeLeft = 32;
    world.score = 980;
    world.coins = 640;
    world.combo = 4;
    world.served = 8;
    order(world, 'geprek', 0.12);
    order(world, 'mieayam', 0.45);
    order(world, 'gado', 0.7);
    world.woks[0] = { item: 'ayam', progress: 0.9, cooked: false };
    world.woks[1] = { item: 'mie', progress: 1, cooked: true };
    world.board = { item: 'sayur', clicks: 3, done: true };
    world.plate = ['mie', 'ayam'];
    addPopup(world, 'KOMBO x4!', 640, 365, '#b8860b');
    addSteam(world, 452, 170, 5);
    addSteam(world, 712, 170, 5);
    return;
  }

  // serve: the plate matches the ticket, bell about to ring, points pop.
  world.elapsed = 64;
  world.timeLeft = 86;
  world.score = 620;
  world.coins = 430;
  world.combo = 3;
  world.served = 5;
  order(world, 'nasgor', 0.55);
  order(world, 'soto', 0.85);
  world.woks[0] = { item: 'telur', progress: 1, cooked: true };
  world.plate = ['nasi', 'telur', 'cabai'];
  addPopup(world, '+248  Nasi Goreng tersaji!', 640, 330, '#2e9e5b');
  addSteam(world, 452, 170, 4);
}

export const SHOT_NAMES = ['start', 'play', 'rush', 'serve'];
