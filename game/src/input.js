// Pointer + keyboard input. The game registers named hit areas each
// frame (rects with an id); input resolves clicks to the topmost area and
// turns keys 1-7 / C / Space / R into the same actions as clicks.
export class Input {
  constructor(canvas, onAction) {
    this.canvas = canvas;
    this.onAction = onAction;
    this.areas = [];
    this.hover = null;
    this.mouse = { x: -1, y: -1 };
    this.keys = new Set();

    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * canvas.width;
      this.mouse.y = ((e.clientY - r.top) / r.height) * canvas.height;
      this.hover = this.hitAt(this.mouse.x, this.mouse.y);
      canvas.style.cursor = this.hover ? 'pointer' : 'default';
    });
    canvas.addEventListener('pointerleave', () => {
      this.mouse.x = -1;
      this.mouse.y = -1;
      this.hover = null;
    });
    canvas.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * canvas.width;
      const y = ((e.clientY - r.top) / r.height) * canvas.height;
      const hit = this.hitAt(x, y);
      if (hit) this.onAction(hit, { x, y });
    });
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.key.toLowerCase());
      if (e.key >= '1' && e.key <= '7') {
        this.onAction({ type: 'ingredient', id: `key-${e.key}` }, null);
      } else if (e.key.toLowerCase() === 'c') {
        this.onAction({ type: 'chop' }, null);
      } else if (e.key === ' ') {
        e.preventDefault();
        this.onAction({ type: 'serve' }, null);
      } else if (e.key.toLowerCase() === 'r') {
        this.onAction({ type: 'restart' }, null);
      } else if (e.key === 'Enter') {
        this.onAction({ type: 'start' }, null);
      }
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
  }

  // Called by render each frame: replace the clickable map.
  setAreas(areas) {
    this.areas = areas;
  }

  hitAt(x, y) {
    for (let i = this.areas.length - 1; i >= 0; i -= 1) {
      const a = this.areas[i];
      if (x >= a.x && x <= a.x + a.w && y >= a.y && y <= a.y + a.h) return a;
    }
    return null;
  }

  isHover(areaId) {
    return this.hover && this.hover.id === areaId;
  }
}
