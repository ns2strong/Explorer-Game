/**
 * Finn's voice. Ava can't read yet, so every message in the game is spoken.
 *
 * 1. If a recorded clip exists for the sentence (made with ElevenLabs by
 *    `npm run voice`), play it.
 * 2. Otherwise use the browser's built-in text-to-speech, picking the most
 *    natural voice the device has.
 *
 * iPad Safari only allows sound after the first tap, which is why the game
 * starts with a big "Play" button that calls `unlockSpeech()`.
 */
import manifest from '../audio-manifest.json';
import { clipKey } from './clipKey';

const CLIPS: Record<string, string> = (manifest as { clips?: Record<string, string> }).clips ?? {};

/** Best first. Premium/Enhanced/Natural voices sound far less robotic. */
const PREFERRED_VOICES = [
  /\(Premium\)/i,
  /\(Enhanced\)/i,
  /Natural/i,
  /^Google US English/,
  /^Samantha/,
  /^Microsoft (Aria|Jenny|Ava)/,
  /^Karen/,
];

let chosen: SpeechSynthesisVoice | null = null;
let enabled = true;
let token = 0;
let audio: HTMLAudioElement | null = null;

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function pickVoice() {
  const s = synth();
  if (!s) return;
  const english = s.getVoices().filter((v) => v.lang.startsWith('en'));
  if (!english.length) return;
  for (const pattern of PREFERRED_VOICES) {
    const v = english.find((x) => pattern.test(x.name) && x.lang === 'en-US') ?? english.find((x) => pattern.test(x.name));
    if (v) {
      chosen = v;
      return;
    }
  }
  chosen = english.find((v) => v.lang === 'en-US') ?? english[0];
}

if (synth()) {
  pickVoice();
  synth()!.addEventListener?.('voiceschanged', pickVoice);
}

export const hasRecordedVoice = () => Object.keys(CLIPS).length > 0;

export function setSpeechEnabled(on: boolean) {
  enabled = on;
  if (!on) stopSpeaking();
}

// A tiny silent WAV, played on the first tap so iOS lets this <audio> element play later.
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

/** Call from inside a tap handler so iOS lets us talk later. */
export function unlockSpeech() {
  try {
    audio ??= new Audio();
    audio.src = SILENCE;
    void audio.play().catch(() => undefined);
  } catch {
    audio = null;
  }
  const s = synth();
  if (!s) return;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  s.speak(u);
}

function speakWithBrowser(text: string, my: number): Promise<boolean> {
  const s = synth();
  if (!s) return Promise.resolve(true); // no speech engine: nothing to wait for
  return new Promise((resolve) => {
    // A short delay after cancel() avoids dropped utterances in Safari/Chrome.
    setTimeout(() => {
      if (my !== token) return resolve(false);
      const u = new SpeechSynthesisUtterance(text);
      if (chosen) u.voice = chosen;
      u.lang = chosen?.lang ?? 'en-US';
      u.rate = 0.95;
      u.pitch = 1.05;
      u.onend = () => resolve(my === token);
      // 'interrupted'/'canceled' means another line cut in; other errors mean it can't speak at all.
      u.onerror = (e) => resolve(e.error !== 'interrupted' && e.error !== 'canceled' && my === token);
      s.speak(u);
    }, 60);
  });
}

function playClip(file: string, text: string, my: number): Promise<boolean> {
  audio ??= new Audio();
  const el = audio;
  return new Promise((resolve) => {
    const done = () => {
      el.onended = el.onerror = null;
      resolve(my === token);
    };
    el.onended = done;
    // If the clip can't load, fall back to the built-in voice.
    el.onerror = () => {
      el.onended = el.onerror = null;
      if (my === token) void speakWithBrowser(text, my).then(resolve);
      else resolve(false);
    };
    el.src = file;
    el.play().catch(() => el.onerror?.(new Event('error')));
  });
}

/**
 * Speak `text`, interrupting anything already being said.
 * Resolves `true` if the line played to the end (or sound is off, so there was
 * nothing to wait for), `false` if it was interrupted. (A clip cut off by
 * another line may never resolve.)
 */
export function say(text: string): Promise<boolean> {
  const my = ++token;
  stopPlayback();
  if (!enabled) return Promise.resolve(true);
  const file = CLIPS[clipKey(text)];
  return file ? playClip(file, text, my) : speakWithBrowser(text, my);
}

function stopPlayback() {
  synth()?.cancel();
  if (audio && !audio.paused) audio.pause();
}

export function stopSpeaking() {
  token++;
  stopPlayback();
}
