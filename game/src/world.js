// Kuali Panas — the rules: orders, chopping, wok, plate, serve, score.
// One loop: click a bin -> chop it if it needs chopping -> wok-cook it ->
// click the wok to plate it -> serve when the plate matches a ticket.
import { GAME, INGREDIENTS, ING_BY_ID, DISHES, DISH_BY_ID } from './config.js';
import { mulberry32, pick } from './random.js';

let orderSeq = 0;

export function newWorld(seed) {
  return {
    seed,
    rng: mulberry32(seed || 1),
    phase: 'title',
    elapsed: 0,
    timeLeft: GAME.daySeconds,
    score: 0,
    coins: 0,
    served: 0,
    failed: 0,
    combo: 0,
    bestCombo: 0,
    orders: [],
    nextOrderIn: GAME.firstOrderAt,
    board: { item: null, clicks: 0, done: false },
    woks: [
      { item: null, progress: 0, cooked: false },
      { item: null, progress: 0, cooked: false },
    ],
    plate: [],
    popups: [],
    particles: [],
    flash: null,
    best: 0,
    stars: 0,
  };
}

export function startDay(world) {
  const keepBest = world.best;
  const fresh = newWorld(world.seed);
  fresh.best = keepBest;
  Object.assign(world, fresh);
  world.phase = 'play';
  spawnOrder(world, true);
  spawnOrder(world, true);
}

function spawnOrder(world, instant) {
  if (world.orders.length >= GAME.maxOrders) return;
  const dish = pick(world.rng, DISHES);
  const patience = GAME.orderPatience * (0.85 + world.rng() * 0.3);
  world.orders.push({
    id: `o${orderSeq += 1}`,
    dishId: dish.id,
    patience,
    maxPatience: patience,
    bornAt: world.elapsed,
    instant: !!instant,
  });
}

function plateMatches(plate, dishId) {
  const needs = DISH_BY_ID[dishId].needs;
  if (plate.length !== needs.length) return false;
  const have = plate.slice().sort().join(',');
  return have === needs.slice().sort().join(',');
}

function matchingOrder(world) {
  return world.orders.find((o) => plateMatches(world.plate, o.dishId)) || null;
}

export function addPopup(world, text, x, y, color) {
  world.popups.push({ text, x, y, ttl: 1.6, color: color || '#2b2118' });
  if (world.popups.length > 6) world.popups.shift();
}

export function addSteam(world, x, y, n) {
  for (let i = 0; i < (n || 3); i += 1) {
    world.particles.push({
      x: x + (world.rng() - 0.5) * 36,
      y,
      vy: -(28 + world.rng() * 22),
      vx: (world.rng() - 0.5) * 8,
      r: 5 + world.rng() * 7,
      ttl: 0.9 + world.rng() * 0.5,
      max: 1.4,
    });
  }
}

// The one entry point for clicks and keys. Returns a sound name to play.
export function handleAction(world, action) {
  if (!action) return null;
  if (world.phase === 'title') {
    if (action.type === 'start') {
      startDay(world);
      return 'ding';
    }
    return null;
  }
  if (world.phase === 'over') {
    if (action.type === 'restart' || action.type === 'start') {
      startDay(world);
      return 'ding';
    }
    return null;
  }

  if (action.type === 'ingredient') {
    const idx = Number(action.id.replace('key-', '')) - 1;
    const ing = INGREDIENTS[idx];
    if (!ing) return null;
    return takeIngredient(world, ing);
  }
  if (action.type === 'board') return chopBoard(world);
  if (action.type === 'chop') return chopBoard(world);
  if (action.type === 'wok') return takeFromWok(world, action.wok);
  if (action.type === 'serve') return servePlate(world, null);
  if (action.type === 'ticket') return servePlate(world, action.order);
  if (action.type === 'trash') {
    if (world.plate.length === 0) return null;
    world.plate = [];
    addPopup(world, 'Piring dibersihkan', 640, 420, '#7a6a58');
    return 'bad';
  }
  if (action.type === 'restart') {
    startDay(world);
    return 'ding';
  }
  return null;
}

function takeIngredient(world, ing) {
  if (ing.kind === 'chop') {
    if (world.board.item) return 'bad';
    world.board.item = ing.id;
    world.board.clicks = 0;
    world.board.done = false;
    return 'add';
  }
  if (ing.kind === 'wok') {
    const wok = world.woks.find((w) => !w.item);
    if (!wok) return 'bad';
    wok.item = ing.id;
    wok.progress = 0;
    wok.cooked = false;
    return 'add';
  }
  if (world.plate.length >= 4) return 'bad';
  world.plate.push(ing.id);
  return 'add';
}

function chopBoard(world) {
  const b = world.board;
  if (!b.item) return null;
  if (b.done) {
    const wok = world.woks.find((w) => !w.item);
    if (!wok) return 'bad';
    wok.item = b.item;
    wok.progress = 0;
    wok.cooked = false;
    b.item = null;
    b.done = false;
    b.clicks = 0;
    return 'add';
  }
  b.clicks += 1;
  if (b.clicks >= GAME.chopClicks) {
    b.done = true;
    addPopup(world, 'Siap dimasak!', 500, 300, '#2e9e5b');
    return 'chop';
  }
  return 'chop';
}

function takeFromWok(world, wokIndex) {
  const wok = world.woks[wokIndex];
  if (!wok || !wok.item || !wok.cooked) return null;
  if (world.plate.length >= 4) return 'bad';
  world.plate.push(wok.item);
  wok.item = null;
  wok.progress = 0;
  wok.cooked = false;
  return 'add';
}

function servePlate(world, orderId) {
  const order = orderId
    ? world.orders.find((o) => o.id === orderId)
    : matchingOrder(world);
  if (!order || !plateMatches(world.plate, order.dishId)) {
    addPopup(world, 'Belum cocok dengan pesanan!', 640, 400, '#d43d2a');
    world.combo = 0;
    return 'bad';
  }
  const dish = DISH_BY_ID[order.dishId];
  const patienceFrac = Math.max(0, order.patience / order.maxPatience);
  const tip = Math.round(GAME.tipMax * patienceFrac);
  world.combo = Math.min(world.combo + 1, GAME.maxCombo);
  world.bestCombo = Math.max(world.bestCombo, world.combo);
  const mult = 1 + (world.combo - 1) * GAME.comboStep;
  const points = Math.round((dish.price + tip) * mult);
  world.score += points;
  world.coins += dish.price;
  world.served += 1;
  world.orders = world.orders.filter((o) => o.id !== order.id);
  world.plate = [];
  addPopup(world, `+${points}  ${dish.name} tersaji!`, 640, 330, '#2e9e5b');
  if (world.combo >= 2) addPopup(world, `KOMBO x${world.combo}!`, 640, 365, '#b8860b');
  world.flash = { ttl: 0.25, color: '#ffe9a8' };
  return 'ding';
}

export function tick(world, dt) {
  if (world.phase !== 'play') return;
  world.elapsed += dt;
  world.timeLeft = Math.max(0, GAME.daySeconds - world.elapsed);

  // Orders get impatient and leave.
  for (const o of world.orders) o.patience -= dt;
  const lost = world.orders.filter((o) => o.patience <= 0);
  if (lost.length > 0) {
    world.orders = world.orders.filter((o) => o.patience > 0);
    world.failed += lost.length;
    world.combo = 0;
    addPopup(world, 'Pesanan kabur! Pelanggan kecewa…', 640, 300, '#d43d2a');
  }

  // New orders arrive faster as the rush builds.
  const rush = world.elapsed / GAME.daySeconds;
  const every = GAME.orderEvery - (GAME.orderEvery - GAME.minOrderEvery) * rush;
  world.nextOrderIn -= dt;
  if (world.nextOrderIn <= 0) {
    spawnOrder(world, false);
    world.nextOrderIn = every;
  }

  // Woks cook.
  for (const wok of world.woks) {
    if (wok.item && !wok.cooked) {
      wok.progress += dt / GAME.cookSeconds;
      if (wok.progress >= 1) {
        wok.progress = 1;
        wok.cooked = true;
        addPopup(world, 'Matang! Angkat dari wajan', 640, 300, '#2e9e5b');
      }
    }
  }

  // Steam + popups age.
  for (const p of world.particles) {
    p.ttl -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  world.particles = world.particles.filter((p) => p.ttl > 0);
  for (const p of world.popups) p.ttl -= dt;
  world.popups = world.popups.filter((p) => p.ttl > 0);
  if (world.flash) {
    world.flash.ttl -= dt;
    if (world.flash.ttl <= 0) world.flash = null;
  }

  // Ambient steam from hot woks.
  if (Math.random() < dt * 6) {
    const hot = world.woks.findIndex((w) => w.item);
    if (hot >= 0) addSteam(world, 470 + hot * 260, 210, 1);
  }

  if (world.timeLeft <= 0) {
    world.phase = 'over';
    world.stars = world.score >= GAME.targetScore ? 3 : world.score >= 800 ? 2 : world.score >= 400 ? 1 : 0;
    world.best = Math.max(world.best, world.score);
  }
}

export { ING_BY_ID };
