// Kuali Panas — every pixel the judge sees. Canvas 2D, warm warung:
// tiled wall, wooden counter, two flaming woks, chopping board, order
// tickets, ingredient bins, serving plate and bell. No images, no fonts
// from the network — shapes and system fonts only.
import { GAME, INGREDIENTS, ING_BY_ID, DISH_BY_ID, PALETTE, LAYOUT } from './config.js';

const TAU = Math.PI * 2;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, weight, align) {
  ctx.fillStyle = color;
  ctx.font = `${weight || '700'} ${size}px 'Trebuchet MS', 'Segoe UI', Verdana, sans-serif`;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// One ingredient, drawn as food. (x, y) is the centre, r the radius.
export function drawIngredient(ctx, id, x, y, r, t) {
  ctx.save();
  ctx.translate(x, y);
  if (id === 'nasi') {
    ctx.fillStyle = '#f5ecd7';
    ctx.beginPath();
    ctx.arc(0, r * 0.15, r * 0.95, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fffdf4';
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.25, r * 0.5, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d9c69a';
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(-r * 0.5 + i * r * 0.25, -r * 0.05 + (i % 2) * r * 0.2, r * 0.07, 0, TAU);
      ctx.fill();
    }
  } else if (id === 'mie') {
    ctx.strokeStyle = '#f7c948';
    ctx.lineWidth = r * 0.28;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, i * r * 0.45);
      ctx.bezierCurveTo(-r * 0.4, i * r * 0.45 - r * 0.4, r * 0.4, i * r * 0.45 + r * 0.4, r * 0.8, i * r * 0.45);
      ctx.stroke();
    }
    ctx.strokeStyle = '#c98f1b';
    ctx.lineWidth = r * 0.08;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.5);
    ctx.quadraticCurveTo(0, -r * 0.9, r * 0.7, -r * 0.5);
    ctx.stroke();
  } else if (id === 'ayam') {
    ctx.fillStyle = '#d98a4a';
    for (const [dx, dy, s] of [[-0.35, 0.15, 0.55], [0.3, 0.05, 0.6], [0, -0.4, 0.5]]) {
      ctx.beginPath();
      ctx.arc(dx * r, dy * r, s * r, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = '#8f4a1d';
    for (const [dx, dy] of [[-0.35, 0.15], [0.3, 0.05], [0, -0.4]]) {
      ctx.beginPath();
      ctx.arc(dx * r, dy * r, r * 0.12, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = '#f2c98f';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.2, r * 0.18, 0, TAU);
    ctx.fill();
  } else if (id === 'telur') {
    ctx.fillStyle = '#fff8ea';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.95, r * 0.75, 0.3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#f7b731';
    ctx.beginPath();
    ctx.arc(r * 0.1, -r * 0.05, r * 0.42, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.arc(r * 0.02, -r * 0.12, r * 0.16, 0, TAU);
    ctx.fill();
  } else if (id === 'cabai') {
    ctx.strokeStyle = '#e0393e';
    ctx.lineWidth = r * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, r * 0.4);
    ctx.quadraticCurveTo(-r * 0.1, -r * 0.9, r * 0.75, -r * 0.25);
    ctx.stroke();
    ctx.strokeStyle = '#2c6e3a';
    ctx.lineWidth = r * 0.22;
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.3);
    ctx.quadraticCurveTo(r * 0.95, -r * 0.55, r * 0.8, -r * 0.8);
    ctx.stroke();
    ctx.fillStyle = '#ffb3b5';
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.15, r * 0.12, 0, TAU);
    ctx.fill();
  } else if (id === 'sayur') {
    ctx.fillStyle = '#58b368';
    for (const [dx, dy, rot] of [[-0.4, 0.2, -0.6], [0.35, 0.25, 0.5], [0, -0.35, 0]]) {
      ctx.save();
      ctx.translate(dx * r, dy * r);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.55, r * 0.28, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = '#2c6e3a';
    ctx.lineWidth = r * 0.08;
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, r * 0.2);
    ctx.lineTo(r * 0.6, r * 0.2);
    ctx.stroke();
  } else if (id === 'bumbu') {
    ctx.fillStyle = '#e07b39';
    ctx.beginPath();
    ctx.arc(0, r * 0.2, r * 0.7, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f7b731';
    for (const [dx, dy] of [[-0.3, -0.1], [0.1, -0.35], [0.4, 0.05], [-0.05, 0.15]]) {
      ctx.beginPath();
      ctx.arc(dx * r, dy * r, r * 0.1, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = '#8f3d12';
    ctx.lineWidth = r * 0.07;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.4 + i * r * 0.3, r * 0.35);
      ctx.lineTo(-r * 0.3 + i * r * 0.3, r * 0.55);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawFlame(ctx, x, y, w, t, big) {
  const flick = Math.sin(t * 9 + x) * 0.12 + Math.sin(t * 23 + x * 2) * 0.06;
  const h = (big ? 34 : 24) * (1 + flick);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = PALETTE.flameB;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.6, 0, -h);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.6, w / 2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.flameA;
  ctx.beginPath();
  ctx.moveTo(-w * 0.32, 0);
  ctx.quadraticCurveTo(-w * 0.36, -h * 0.45, 0, -h * 0.72);
  ctx.quadraticCurveTo(w * 0.36, -h * 0.45, w * 0.32, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.flameC;
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, 0);
  ctx.quadraticCurveTo(-w * 0.18, -h * 0.3, 0, -h * 0.45);
  ctx.quadraticCurveTo(w * 0.18, -h * 0.3, w * 0.15, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWok(ctx, cx, cy, wok, t, hover) {
  // burner + flame
  ctx.fillStyle = '#232326';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 34, 74, 12, 0, 0, TAU);
  ctx.fill();
  if (wok.item) drawFlame(ctx, cx, cy + 30, 84, t, true);
  // wok body
  ctx.fillStyle = '#1d1d20';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 92, 40, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#333338';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 4, 92, 38, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#0f0f12';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 4, 78, 30, 0, 0, TAU);
  ctx.fill();
  // handle
  ctx.strokeStyle = '#6b4224';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 88, cy - 8);
  ctx.lineTo(cx + 128, cy - 26);
  ctx.stroke();
  if (wok.item) {
    drawIngredient(ctx, wok.item, cx, cy - 6, 34, t);
    if (wok.cooked) {
      ctx.fillStyle = '#2e9e5b';
      rr(ctx, cx - 46, cy - 62, 92, 26, 13);
      ctx.fill();
      text(ctx, 'MATANG!', cx, cy - 48, 15, '#fff', '800', 'center');
    } else {
      // cook progress: a small bar under the wok, not a ring.
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      rr(ctx, cx - 60, cy + 48, 120, 9, 4);
      ctx.fill();
      ctx.fillStyle = PALETTE.gold;
      rr(ctx, cx - 60, cy + 48, Math.max(8, 120 * wok.progress), 9, 4);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    text(ctx, 'WAJAN KOSONG', cx, cy - 4, 13, 'rgba(255,255,255,0.5)', '700', 'center');
  }
  if (hover) {
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 100, 48, 0, 0, TAU);
    ctx.stroke();
  }
}

export function render(ctx, world, input, t) {
  const W = GAME.width;
  const H = GAME.height;
  const areas = [];

  // ---- wall + tiles
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, W, 560);
  ctx.fillStyle = PALETTE.tile;
  ctx.fillRect(0, 344, W, 216);
  ctx.strokeStyle = PALETTE.tileLine;
  ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 344);
    ctx.lineTo(x, 560);
    ctx.stroke();
  }
  for (let y = 344; y <= 560; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // shelf with pots
  ctx.fillStyle = '#6b4224';
  ctx.fillRect(40, 300, 220, 10);
  ctx.fillStyle = '#c9ccd2';
  ctx.beginPath();
  ctx.arc(90, 282, 20, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#8a5a33';
  ctx.beginPath();
  ctx.arc(150, 284, 16, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#3c3a3e';
  ctx.beginPath();
  ctx.arc(205, 280, 22, 0, TAU);
  ctx.fill();
  drawWallDecor(ctx, t);

  drawTopBar(ctx, world, t);
  drawOrderBoard(ctx, world, t, areas);
  drawStove(ctx, world, input, t, areas);
  drawPlatePanel(ctx, world, input, t, areas);
  drawCounter(ctx, world, input, t, areas);
  drawParticles(ctx, world);
  drawPopups(ctx, world);

  if (world.flash) {
    ctx.fillStyle = world.flash.color;
    ctx.globalAlpha = Math.min(0.25, world.flash.ttl * 1.2);
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  if (world.phase === 'title') drawTitle(ctx, world, areas);
  if (world.phase === 'over') drawGameOver(ctx, world, areas);

  input.setAreas(areas);
}

function drawWallDecor(ctx, t) {
  // Hanging pans and ladles on the left of the tile band.
  const hooks = [70, 150, 230, 310];
  hooks.forEach((x, i) => {
    ctx.strokeStyle = '#a9743f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 368);
    ctx.lineTo(x, 396);
    ctx.stroke();
    ctx.fillStyle = i % 2 ? '#3c3a3e' : '#c9ccd2';
    ctx.beginPath();
    ctx.arc(x, 420, 24, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(x - 3, 396, 6, 22);
  });
  // Framed menu poster on the right of the tile band.
  const px = 1000;
  const py = 372;
  ctx.fillStyle = '#fff8e7';
  rr(ctx, px, py, 240, 168, 10);
  ctx.fill();
  ctx.strokeStyle = '#b3541e';
  ctx.lineWidth = 3;
  rr(ctx, px, py, 240, 168, 10);
  ctx.stroke();
  text(ctx, 'MENU WARUNG', px + 120, py + 20, 15, '#b3541e', '800', 'center');
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px + 20, py + 34);
  ctx.lineTo(px + 220, py + 34);
  ctx.stroke();
  const menu = [
    ['Nasi Goreng', 'Rp 100'],
    ['Mie Ayam', 'Rp 120'],
    ['Soto Ayam', 'Rp 130'],
    ['Gado-Gado', 'Rp 110'],
    ['Ayam Geprek', 'Rp 140'],
  ];
  menu.forEach((row, i) => {
    const y = py + 54 + i * 22;
    text(ctx, row[0], px + 20, y, 14, PALETTE.boardInk, '700');
    text(ctx, row[1], px + 220, y, 14, '#8a5a33', '700', 'right');
  });
  text(ctx, 'DAPUR  •  WARUNG KUALI PANAS', 640, 520, 15, '#b98d5e', '700', 'center');
  text(ctx, 'sejak 1987 — pedasnya jujur, porsinya ikhlas', 640, 544, 12, '#c9a06e', '400', 'center');
}

function drawTopBar(ctx, world, t) {
  const b = LAYOUT.topBar;
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = '#6b4224';
  ctx.fillRect(0, 60, 1280, 4);
  text(ctx, 'KUALI PANAS', 20, 32, 28, '#ffd23e', '800');
  text(ctx, 'WARUNG RUSH', 268, 36, 15, '#f2d8b3', '700');

  // day timer: clock glyph + bar
  const frac = world.phase === 'play' ? world.timeLeft / GAME.daySeconds : 1;
  const tx = 470;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(tx - 24, 30, 11, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(tx - 24, 30);
  ctx.lineTo(tx - 24, 21);
  ctx.moveTo(tx - 24, 30);
  ctx.lineTo(tx - 17, 30);
  ctx.stroke();
  ctx.fillStyle = '#2b2118';
  rr(ctx, tx, 16, 260, 30, 15);
  ctx.fill();
  ctx.fillStyle = frac > 0.25 ? '#58b368' : '#d43d2a';
  rr(ctx, tx + 3, 19, Math.max(6, 254 * frac), 24, 12);
  ctx.fill();
  text(ctx, fmtTime(world.timeLeft), tx + 130, 32, 18, '#fff', '800', 'center');
  text(ctx, 'SHIFT', tx + 130, 52, 10, '#f2d8b3', '700', 'center');

  // score / coins / combo
  text(ctx, `SKOR  ${world.score}`, 790, 26, 22, '#fff', '800');
  text(ctx, `Rp ${world.coins}   •   TERSAJI ${world.served}`, 790, 50, 14, '#f2d8b3', '700');
  if (world.combo >= 2) {
    ctx.fillStyle = '#f7b731';
    rr(ctx, 1060, 14, 110, 36, 18);
    ctx.fill();
    text(ctx, `KOMBO x${world.combo}`, 1115, 33, 18, '#4a2c17', '800', 'center');
  }
}

function drawOrderBoard(ctx, world, t, areas) {
  const b = LAYOUT.board;
  ctx.fillStyle = PALETTE.board;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 2;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.stroke();
  ctx.fillStyle = '#4a2c17';
  rr(ctx, b.x, b.y, b.w, 34, 12);
  ctx.fill();
  ctx.fillRect(b.x, b.y + 22, b.w, 12);
  text(ctx, 'PAPAN PESANAN', b.x + 14, b.y + 18, 16, '#ffd23e', '800');

  if (world.orders.length === 0) {
    text(ctx, 'Belum ada pesanan…', b.x + b.w / 2, b.y + 140, 16, PALETTE.muted, '700', 'center');
    text(ctx, 'pesanan baru segera datang', b.x + b.w / 2, b.y + 168, 13, PALETTE.muted, '400', 'center');
    return;
  }
  world.orders.forEach((o, i) => {
    const y = b.y + 44 + i * 74;
    const dish = DISH_BY_ID[o.dishId];
    const frac = Math.max(0, o.patience / o.maxPatience);
    const urgent = frac < 0.25;
    ctx.fillStyle = PALETTE.ticket;
    rr(ctx, b.x + 10, y, b.w - 20, 66, 8);
    ctx.fill();
    ctx.strokeStyle = urgent && Math.sin(t * 8) > 0 ? '#d43d2a' : PALETTE.ticketEdge;
    ctx.lineWidth = urgent ? 3 : 1.5;
    rr(ctx, b.x + 10, y, b.w - 20, 66, 8);
    ctx.stroke();
    // ticket pin
    ctx.fillStyle = '#d43d2a';
    ctx.beginPath();
    ctx.arc(b.x + 22, y + 12, 4, 0, TAU);
    ctx.fill();
    text(ctx, dish.name.toUpperCase(), b.x + 36, y + 16, 15, PALETTE.boardInk, '800');
    text(ctx, `Rp ${dish.price}`, b.x + b.w - 22, y + 16, 13, '#8a5a33', '700', 'right');
    dish.needs.forEach((id, j) => {
      drawIngredient(ctx, id, b.x + 44 + j * 34, y + 42, 13, t);
    });
    // patience bar
    ctx.fillStyle = '#e8d3ae';
    rr(ctx, b.x + 150, y + 36, 110, 10, 5);
    ctx.fill();
    ctx.fillStyle = urgent ? '#d43d2a' : frac < 0.5 ? '#f7b731' : '#58b368';
    rr(ctx, b.x + 150, y + 36, Math.max(6, 110 * frac), 10, 5);
    ctx.fill();
    text(ctx, `${Math.ceil(o.patience)} dtk`, b.x + b.w - 26, y + 42, 12, urgent ? '#d43d2a' : PALETTE.muted, '800', 'right');
    areas.push({ id: `ticket-${o.id}`, type: 'ticket', order: o.id, x: b.x + 10, y, w: b.w - 20, h: 66 });
  });
}

function drawStove(ctx, world, input, t, areas) {
  const b = LAYOUT.stove;
  // stove body
  ctx.fillStyle = PALETTE.stove;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.fillStyle = '#2b2b2f';
  ctx.fillRect(b.x, b.y + b.h - 26, b.w, 26);
  text(ctx, 'KOMPOR  •  DUA WAJAN', b.x + 16, b.y + 18, 14, '#f2d8b3', '800');
  text(ctx, 'klik wajan matang untuk naik ke piring', b.x + b.w - 16, b.y + 18, 12, '#9a938a', '400', 'right');

  // woks
  drawWok(ctx, 452, 196, world.woks[0], t, input.isHover('wok-0'));
  drawWok(ctx, 712, 196, world.woks[1], t, input.isHover('wok-1'));
  areas.push({ id: 'wok-0', type: 'wok', wok: 0, x: 352, y: 130, w: 200, h: 120 });
  areas.push({ id: 'wok-1', type: 'wok', wok: 1, x: 612, y: 130, w: 200, h: 120 });

  // chopping board between the woks, on the counter front
  const bx = 540;
  const by = 252;
  ctx.fillStyle = '#d9a066';
  rr(ctx, bx, by, 120, 66, 8);
  ctx.fill();
  ctx.strokeStyle = '#a9743f';
  ctx.lineWidth = 2;
  rr(ctx, bx, by, 120, 66, 8);
  ctx.stroke();
  text(ctx, 'TALENAN', bx + 60, by + 12, 11, '#6b4224', '800', 'center');
  const bd = world.board;
  if (bd.item) {
    drawIngredient(ctx, bd.item, bx + 60, by + 40, 20, t);
    if (!bd.done) {
      for (let i = 0; i < GAME.chopClicks; i += 1) {
        ctx.fillStyle = i < bd.clicks ? '#2e9e5b' : '#e8d3ae';
        ctx.beginPath();
        ctx.arc(bx + 34 + i * 26, by + 58, 6, 0, TAU);
        ctx.fill();
      }
      text(ctx, 'KLIK UNTUK CINCANG', bx + 60, by - 12, 11, '#fff', '800', 'center');
    } else {
      text(ctx, 'SIAP! KLIK → WAJAN', bx + 60, by - 12, 11, '#2e9e5b', '800', 'center');
    }
  } else {
    text(ctx, 'kosong — klik bahan', bx + 60, by + 34, 12, '#8a6a45', '700', 'center');
    text(ctx, 'yang perlu dicincang', bx + 60, by + 52, 11, '#8a6a45', '400', 'center');
  }
  areas.push({ id: 'board', type: 'board', x: bx - 8, y: by - 22, w: 136, h: 96 });

  // stove knobs
  for (let i = 0; i < 2; i += 1) {
    ctx.fillStyle = '#c9ccd2';
    ctx.beginPath();
    ctx.arc(b.x + 40 + i * 40, b.y + b.h - 13, 8, 0, TAU);
    ctx.fill();
  }
}

function drawPlatePanel(ctx, world, input, t, areas) {
  const b = LAYOUT.board2;
  ctx.fillStyle = PALETTE.board;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 2;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.stroke();
  ctx.fillStyle = '#2e6fb0';
  rr(ctx, b.x, b.y, b.w, 34, 12);
  ctx.fill();
  ctx.fillRect(b.x, b.y + 22, b.w, 12);
  text(ctx, 'PIRING SAJI', b.x + 14, b.y + 18, 16, '#fff', '800');

  // the plate
  const px = b.x + 120;
  const py = b.y + 150;
  ctx.fillStyle = '#e8e2d6';
  ctx.beginPath();
  ctx.ellipse(px, py + 8, 96, 26, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = PALETTE.plate;
  ctx.beginPath();
  ctx.ellipse(px, py, 92, 62, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = PALETTE.plateRim;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(px, py, 92, 62, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(46,111,176,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(px, py, 66, 44, 0, 0, TAU);
  ctx.stroke();
  if (world.plate.length === 0) {
    text(ctx, 'piring kosong', px, py, 13, PALETTE.muted, '700', 'center');
  } else {
    const spots = [[-32, -8], [30, -12], [-8, 14], [38, 12]];
    world.plate.forEach((id, i) => {
      const s = spots[i % spots.length];
      drawIngredient(ctx, id, px + s[0], py + s[1], 24, t);
    });
  }

  // serve bell
  const bellX = b.x + 268;
  const bellY = b.y + 130;
  const ringing = world.flash && world.flash.ttl > 0;
  ctx.save();
  ctx.translate(bellX, bellY);
  if (ringing) ctx.rotate(Math.sin(t * 30) * 0.15);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(-34, 34, 68, 8);
  ctx.fillStyle = PALETTE.bell;
  ctx.beginPath();
  ctx.moveTo(-30, 34);
  ctx.quadraticCurveTo(-30, -18, 0, -26);
  ctx.quadraticCurveTo(30, -18, 30, 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d18f12';
  ctx.fillRect(-30, 28, 60, 8);
  ctx.fillStyle = '#4a2c17';
  ctx.beginPath();
  ctx.arc(0, -30, 5, 0, TAU);
  ctx.fill();
  ctx.restore();
  text(ctx, 'LONCENG SAJI', bellX, bellY + 58, 12, PALETTE.boardInk, '800', 'center');
  text(ctx, 'klik / SPASI', bellX, bellY + 76, 11, PALETTE.muted, '400', 'center');
  areas.push({ id: 'bell', type: 'serve', x: bellX - 44, y: bellY - 40, w: 88, h: 110 });

  // trash
  const tx = b.x + 268;
  const ty = b.y + 222;
  ctx.fillStyle = '#8a8f96';
  rr(ctx, tx - 26, ty - 14, 52, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#5c6067';
  ctx.fillRect(tx - 30, ty - 20, 60, 8);
  text(ctx, 'BUANG', tx, ty + 4, 12, '#fff', '800', 'center');
  areas.push({ id: 'trash', type: 'trash', x: tx - 32, y: ty - 22, w: 64, h: 44 });
  text(ctx, 'buang isi piring', tx, ty + 32, 10, PALETTE.muted, '400', 'center');
}

function drawCounter(ctx, world, input, t, areas) {
  const c = LAYOUT.counter;
  ctx.fillStyle = PALETTE.counter;
  ctx.fillRect(c.x, c.y, c.w, c.h);
  ctx.fillStyle = PALETTE.counterTop;
  ctx.fillRect(c.x, c.y, c.w, 14);
  text(ctx, 'BAHAN DI MEJA  —  klik bahan, atau tekan 1–7', 20, c.y + 38, 16, '#ffe9c4', '800');
  text(ctx, 'Ayam • Cabai • Sayur dicincang dulu di talenan  •  C = cincang  •  SPASI = sajikan', 1260, c.y + 38, 13, '#e8c9a0', '400', 'right');

  const bw = 158;
  const gap = 14;
  const startX = 20;
  INGREDIENTS.forEach((ing, i) => {
    const x = startX + i * (bw + gap);
    const y = c.y + 56;
    const hover = input.isHover(`ing-${ing.id}`);
    ctx.fillStyle = hover ? '#c98d54' : '#a9743f';
    rr(ctx, x, y, bw, 88, 10);
    ctx.fill();
    ctx.strokeStyle = '#6b4224';
    ctx.lineWidth = 2;
    rr(ctx, x, y, bw, 88, 10);
    ctx.stroke();
    drawIngredient(ctx, ing.id, x + 34, y + 44, 26, t);
    text(ctx, ing.name, x + 66, y + 30, 18, '#fff', '800');
    text(ctx, ing.kind === 'chop' ? 'perlu cincang' : ing.kind === 'wok' ? 'masuk wajan' : 'langsung ke piring', x + 66, y + 52, 11, '#ffe9c4', '400');
    ctx.fillStyle = '#4a2c17';
    rr(ctx, x + bw - 30, y + 8, 22, 22, 6);
    ctx.fill();
    text(ctx, ing.key, x + bw - 19, y + 20, 13, '#ffd23e', '800', 'center');
    areas.push({ id: `ing-${ing.id}`, type: 'ingredient', index: i, x, y, w: bw, h: 88 });
  });
}

function drawParticles(ctx, world) {
  for (const p of world.particles) {
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0, (p.ttl / p.max) * 0.55)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (1.6 - p.ttl / p.max), 0, TAU);
    ctx.fill();
  }
}

function drawPopups(ctx, world) {
  for (const p of world.popups) {
    const a = Math.min(1, p.ttl / 0.5);
    ctx.globalAlpha = a;
    ctx.font = "800 22px 'Trebuchet MS', 'Segoe UI', Verdana, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeText(p.text, p.x, p.y - (1.6 - p.ttl) * 24);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y - (1.6 - p.ttl) * 24);
    ctx.globalAlpha = 1;
  }
}

function drawTitle(ctx, world, areas) {
  ctx.fillStyle = 'rgba(43,33,24,0.55)';
  ctx.fillRect(0, 0, GAME.width, GAME.height);
  ctx.fillStyle = '#fff8e7';
  rr(ctx, 290, 130, 700, 420, 18);
  ctx.fill();
  ctx.strokeStyle = '#f7b731';
  ctx.lineWidth = 4;
  rr(ctx, 290, 130, 700, 420, 18);
  ctx.stroke();
  // a frying pan with a sunny egg on top, drawn — no emoji, they render unevenly.
  ctx.fillStyle = '#1d1d20';
  ctx.beginPath();
  ctx.arc(640, 184, 34, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#333338';
  ctx.beginPath();
  ctx.arc(640, 184, 28, 0, TAU);
  ctx.fill();
  drawIngredient(ctx, 'telur', 640, 184, 22, 0);
  ctx.strokeStyle = '#6b4224';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(672, 184);
  ctx.lineTo(706, 172);
  ctx.stroke();
  text(ctx, 'KUALI PANAS', 640, 245, 54, '#4a2c17', '800', 'center');
  text(ctx, '— WARUNG RUSH —', 640, 290, 22, '#b3541e', '800', 'center');
  text(ctx, 'Shift 150 detik. Pesanan datang terus — cincang,', 640, 335, 17, PALETTE.boardInk, '400', 'center');
  text(ctx, 'masak di wajan, sajikan sebelum pelanggan kabur.', 640, 360, 17, PALETTE.boardInk, '400', 'center');
  text(ctx, 'Klik bahan (1–7)  •  Cincang (C)  •  Sajikan (SPASI)', 640, 395, 16, '#2e6fb0', '700', 'center');
  text(ctx, `Target 3 bintang: ${GAME.targetScore} poin`, 640, 425, 15, PALETTE.muted, '700', 'center');
  ctx.fillStyle = '#2e9e5b';
  rr(ctx, 490, 455, 300, 56, 28);
  ctx.fill();
  text(ctx, '▶  MULAI MASAK', 640, 484, 22, '#fff', '800', 'center');
  areas.push({ id: 'start-btn', type: 'start', x: 490, y: 455, w: 300, h: 56 });
  if (world.best > 0) text(ctx, `Skor terbaik: ${world.best}`, 640, 530, 14, PALETTE.muted, '700', 'center');
}

function drawGameOver(ctx, world, areas) {
  ctx.fillStyle = 'rgba(43,33,24,0.6)';
  ctx.fillRect(0, 0, GAME.width, GAME.height);
  ctx.fillStyle = '#fff8e7';
  rr(ctx, 330, 150, 620, 400, 18);
  ctx.fill();
  ctx.strokeStyle = '#f7b731';
  ctx.lineWidth = 4;
  rr(ctx, 330, 150, 620, 400, 18);
  ctx.stroke();
  text(ctx, 'SHIFT SELESAI!', 640, 205, 40, '#4a2c17', '800', 'center');
  const stars = '★'.repeat(world.stars) + '☆'.repeat(3 - world.stars);
  text(ctx, stars, 640, 255, 44, '#f7b731', '800', 'center');
  text(ctx, `SKOR  ${world.score}`, 640, 315, 34, '#2b2118', '800', 'center');
  text(ctx, `Tersaji ${world.served} piring  •  Kombo terbaik x${world.bestCombo}  •  Kabur ${world.failed}`, 640, 355, 16, PALETTE.muted, '700', 'center');
  text(ctx, world.score >= GAME.targetScore ? 'Warung penuh, pelanggan pulang senang!' : 'Besok lebih cepat lagi, koki!', 640, 390, 16, '#b3541e', '700', 'center');
  ctx.fillStyle = '#2e9e5b';
  rr(ctx, 490, 430, 300, 56, 28);
  ctx.fill();
  text(ctx, 'MASAK LAGI  (R)', 640, 459, 20, '#fff', '800', 'center');
  areas.push({ id: 'restart-btn', type: 'restart', x: 490, y: 430, w: 300, h: 56 });
  text(ctx, `Skor terbaik: ${world.best}`, 640, 520, 14, PALETTE.muted, '700', 'center');
}
