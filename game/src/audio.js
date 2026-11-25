// Tiny synth sounds, generated with WebAudio — no audio files, no network.
// Sizzle is filtered noise, chops and dings are short oscillator blips.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sizzleNodes = null;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  blip(freq, dur, type, vol, slideTo) {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol || 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  chop() {
    this.blip(180, 0.07, 'square', 0.1, 90);
  }

  add() {
    this.blip(520, 0.06, 'triangle', 0.08, 700);
  }

  ding() {
    this.blip(880, 0.35, 'sine', 0.14, 880);
    setTimeout(() => this.blip(1318, 0.4, 'sine', 0.1, 1318), 90);
  }

  bad() {
    this.blip(140, 0.18, 'sawtooth', 0.08, 90);
  }

  startSizzle() {
    if (!this.enabled || this.sizzleNodes) return;
    this.ensure();
    if (!this.ctx) return;
    const len = this.ctx.sampleRate * 1;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 5200;
    filt.Q.value = 0.6;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.025;
    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
    this.sizzleNodes = { src, gain };
  }

  stopSizzle() {
    if (!this.sizzleNodes) return;
    try {
      this.sizzleNodes.src.stop();
    } catch (e) {
      /* already stopped */
    }
    this.sizzleNodes = null;
  }
}
