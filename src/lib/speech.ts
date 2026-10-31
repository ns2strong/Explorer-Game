/**
 * Narration using the browser's built-in text-to-speech.
 * Ava can't read yet, so every message in the game is spoken.
 *
 * iPad Safari only allows speech after the first tap, which is why the
 * game starts with a big "Play" button that calls `unlockSpeech()`.
 */

const PREFERRED_VOICES = [
  'Samantha', // macOS / iPadOS
  'Google US English',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Karen',
  'Moira',
];

let chosen: SpeechSynthesisVoice | null = null;
let enabled = true;
let token = 0;

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function pickVoice() {
  const s = synth();
  if (!s) return;
  const voices = s.getVoices();
  if (!voices.length) return;
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((x) => x.name.startsWith(name));
    if (v) {
      chosen = v;
      return;
    }
  }
  chosen = voices.find((v) => v.lang === 'en-US') ?? voices.find((v) => v.lang.startsWith('en')) ?? null;
}

if (synth()) {
  pickVoice();
  synth()!.addEventListener?.('voiceschanged', pickVoice);
}

export function setSpeechEnabled(on: boolean) {
  enabled = on;
  if (!on) synth()?.cancel();
}

/** Call from inside a tap handler so iOS lets us talk later. */
export function unlockSpeech() {
  const s = synth();
  if (!s) return;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  s.speak(u);
}

/**
 * Speak `text`, interrupting anything already being said.
 * Resolves when finished (or immediately if speech is unavailable/disabled).
 */
export function say(text: string): Promise<void> {
  const s = synth();
  const my = ++token;
  if (!s || !enabled) return Promise.resolve();
  s.cancel();
  return new Promise((resolve) => {
    // A short delay after cancel() avoids dropped utterances in Safari/Chrome.
    setTimeout(() => {
      if (my !== token) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      if (chosen) u.voice = chosen;
      u.lang = chosen?.lang ?? 'en-US';
      u.rate = 0.92;
      u.pitch = 1.1;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      s.speak(u);
    }, 60);
  });
}

export function stopSpeaking() {
  token++;
  synth()?.cancel();
}
