/**
 * Every sentence Finn can say lives here.
 *
 * The game builds its narration from these functions, and
 * `scripts/generate-voice.ts` uses `allLines()` to record each one with
 * ElevenLabs. Keeping them in one place means every line gets a recording.
 * `{name}` is replaced with the player's name.
 */
import type { Thing, UsState } from './states';
import { STATES } from './states';
import type { Region } from './regions';
import { REGIONS } from './regions';
import { MISSIONS } from './missions';
import { ACHIEVEMENTS } from './achievements';
import { personalize } from '../lib/progress';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const stamps = (n: number) => (n === 1 ? 'one stamp' : `${n} stamps`);

export const L = {
  greetNew: 'Hi {name}! I’m Finn the fox. Let’s explore the United States of America! Tap a color on the map to go there.',
  welcomeBack: 'Welcome back, {name}! Where should we explore today?',
  usa: 'This is the United States of America! It has fifty states.',
  home: 'Here is the whole United States! Tap a color to explore.',
  stopMission: 'Okay! Let’s just explore.',
  anotherMission: 'Want another mission? Tap the star!',
  badgeLocked: 'Keep exploring to earn this badge!',
  stampEmpty: 'Find this state on the map to get the stamp!',
  idleHints: [
    'Tap a color on the map to go exploring, {name}!',
    'Want a mission? Tap the big star!',
    'Tap the blue book to see your passport stamps!',
    'Which state will we visit next, {name}?',
  ],

  stateFact: (s: UsState) => `${s.name}! ${s.fact}`,
  thing: (t: Thing) => `${capitalize(t.word)}! ${t.detail}`,
  capital: (s: UsState) => `The capital city of ${s.name} is ${s.capital}.`,
  wrongState: (s: UsState) => `That’s ${s.name}! Keep looking, you can do it!`,
  regionGood: (r: Region) => `${r.name}! Good thinking, {name}! Can you find it here?`,
  regionWrong: (r: Region) => `${r.name}! Hmm, I don’t think it’s here. Tap the house to look somewhere else!`,
  passport: (n: number) => `{name}'s passport! You have ${stamps(n)}.`,
};

/** Every line the game can speak, personalized for `name`, without duplicates. */
export function allLines(name: string): string[] {
  const out: string[] = [
    L.greetNew, L.welcomeBack, L.usa, L.home, L.stopMission, L.anotherMission,
    L.badgeLocked, L.stampEmpty, ...L.idleHints,
  ];
  for (const s of STATES) {
    out.push(L.stateFact(s), L.capital(s), L.wrongState(s));
    for (const t of s.things) out.push(L.thing(t));
  }
  for (const r of REGIONS) out.push(r.name, r.intro, L.regionGood(r), L.regionWrong(r));
  for (const m of MISSIONS) out.push(m.ask, m.cheer);
  for (const a of ACHIEVEMENTS) out.push(a.title, a.cheer);
  for (let n = 0; n <= 50; n++) out.push(L.passport(n));
  return [...new Set(out.map((l) => personalize(l, name)))];
}
