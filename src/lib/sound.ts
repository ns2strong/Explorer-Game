/**
 * Tiny sound effects generated with the Web Audio API — no audio files needed.
 */

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

/** Call from a tap handler (required by iOS before audio can play). */
export function unlockSound() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctx && AC) ctx = new AC();
    void ctx?.resume();
  } catch {
    ctx = null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  if (!ctx || !enabled) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  /** Soft bubble pop when tapping a state. */
  pop() {
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(380, t0);
    osc.frequency.exponentialRampToValueAtTime(900, t0 + 0.09);
    gain.gain.setValueAtTime(0.2, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.2);
  },
  /** Whoosh-ish rising sweep for zooming. */
  zoom() {
    tone(300, 0, 0.25, 'triangle', 0.1);
    tone(450, 0.08, 0.25, 'triangle', 0.1);
    tone(600, 0.16, 0.3, 'triangle', 0.1);
  },
  /** Stamp thunk + sparkle for a new passport stamp. */
  stamp() {
    tone(160, 0, 0.18, 'square', 0.12);
    tone(1320, 0.12, 0.2, 'sine', 0.12);
    tone(1760, 0.2, 0.25, 'sine', 0.1);
  },
  /** Gentle "try again" — never a harsh buzzer. */
  hmm() {
    tone(440, 0, 0.18, 'sine', 0.12);
    tone(392, 0.16, 0.25, 'sine', 0.12);
  },
  /** Happy fanfare for missions and badges. */
  fanfare() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.16));
    tone(1047, 0.48, 0.6, 'triangle', 0.14);
    tone(1319, 0.48, 0.6, 'sine', 0.08);
  },
};
