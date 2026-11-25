// Kuali Panas — Warung Rush: all tunable numbers in one place.
// A timed warung cooking game: take orders, chop, wok-cook, plate, serve.
export const GAME = {
  width: 1280,
  height: 720,
  daySeconds: 150,
  maxOrders: 3,
  orderPatience: 45,
  firstOrderAt: 2,
  orderEvery: 13,
  minOrderEvery: 8,
  chopClicks: 3,
  cookSeconds: 4.5,
  serveBase: 100,
  tipMax: 80,
  comboStep: 0.25,
  maxCombo: 5,
  targetScore: 1200,
};

// Every ingredient the warung stocks. kind decides its journey:
// "wok" goes straight to the wok, "chop" must be chopped first,
// "plate" is sprinkled straight onto the plate.
export const INGREDIENTS = [
  { id: 'nasi', name: 'Nasi', key: '1', kind: 'wok', color: '#f5ecd7', dark: '#cbb98f' },
  { id: 'mie', name: 'Mie', key: '2', kind: 'wok', color: '#f7c948', dark: '#c98f1b' },
  { id: 'ayam', name: 'Ayam', key: '3', kind: 'chop', color: '#d98a4a', dark: '#8f4a1d' },
  { id: 'telur', name: 'Telur', key: '4', kind: 'wok', color: '#ffe9a8', dark: '#e0a92e' },
  { id: 'cabai', name: 'Cabai', key: '5', kind: 'chop', color: '#e0393e', dark: '#8f1418' },
  { id: 'sayur', name: 'Sayur', key: '6', kind: 'chop', color: '#58b368', dark: '#2c6e3a' },
  { id: 'bumbu', name: 'Bumbu', key: '7', kind: 'plate', color: '#e07b39', dark: '#8f3d12' },
];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// The warung's menu. Each dish is a set of ingredients; the ticket
// shows them, the plate must hold exactly that set (order free).
export const DISHES = [
  { id: 'nasgor', name: 'Nasi Goreng', needs: ['nasi', 'telur', 'cabai'], price: 100 },
  { id: 'mieayam', name: 'Mie Ayam', needs: ['mie', 'ayam', 'sayur'], price: 120 },
  { id: 'soto', name: 'Soto Ayam', needs: ['ayam', 'telur', 'bumbu'], price: 130 },
  { id: 'gado', name: 'Gado-Gado', needs: ['sayur', 'telur', 'bumbu'], price: 110 },
  { id: 'geprek', name: 'Ayam Geprek', needs: ['ayam', 'cabai', 'bumbu'], price: 140 },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map((d) => [d.id, d]));

// Warm warung palette: terracotta walls, cream tiles, dark wood.
export const PALETTE = {
  wall: '#f2d8b3',
  wallDark: '#e3bd8a',
  tile: '#fbf3e4',
  tileLine: '#e8d3ae',
  counter: '#8a5a33',
  counterTop: '#a9743f',
  counterEdge: '#6b4224',
  board: '#fff8e7',
  boardInk: '#3a2a1a',
  ticket: '#fffdf4',
  ticketEdge: '#d8c49a',
  stove: '#3c3a3e',
  steel: '#c9ccd2',
  flameA: '#ff9d2e',
  flameB: '#ff5f1f',
  flameC: '#ffd23e',
  plate: '#ffffff',
  plateRim: '#2e6fb0',
  ink: '#2b2118',
  muted: '#7a6a58',
  good: '#2e9e5b',
  bad: '#d43d2a',
  gold: '#f7b731',
  bell: '#f7b731',
};

export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 64 },
  board: { x: 16, y: 76, w: 296, h: 268 },
  stove: { x: 336, y: 76, w: 560, h: 268 },
  board2: { x: 920, y: 76, w: 344, h: 268 },
  counter: { x: 0, y: 560, w: 1280, h: 160 },
};
