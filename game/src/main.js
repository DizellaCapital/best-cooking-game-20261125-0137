// Kuali Panas — boot + game loop. Wires the world, the renderer, the
// input and the sounds together; a ?shot= query picks a frozen showcase
// scene for screenshots, otherwise the game plays live.
import { GAME } from './config.js';
import { SoundBank } from './audio.js';
import { Input } from './input.js';
import { newWorld, handleAction, tick } from './world.js';
import { render } from './render.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = GAME.width;
canvas.height = GAME.height;

const params = new URLSearchParams(window.location.search);
const seed = Number(params.get('seed') || '1');
const shot = params.get('shot');

const world = newWorld(seed);
const sounds = new SoundBank();
const input = new Input(canvas, (action) => {
  const sound = handleAction(world, action);
  if (sound === 'ding') sounds.ding();
  else if (sound === 'chop') sounds.chop();
  else if (sound === 'add') sounds.add();
  else if (sound === 'bad') sounds.bad();
  if (world.phase === 'play') {
    const cooking = world.woks.some((w) => w.item);
    if (cooking) sounds.startSizzle();
    else sounds.stopSizzle();
  }
});

let frozen = false;
if (shot) {
  applyShot(world, shot);
  frozen = true;
  // Showcase scenes are stills: keep the timer and steam exactly as set.
  document.title = `Kuali Panas — shot ${shot}`;
}

let last = performance.now();
let t = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!frozen) {
    t += dt;
    tick(world, dt);
  } else {
    // Frozen scenes still shimmer a touch so flames and steam read alive.
    t += dt * 0.25;
  }
  render(ctx, world, input, t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
