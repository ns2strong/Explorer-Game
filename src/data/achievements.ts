import { REGIONS } from './regions';
import { STATES } from './states';
import { MISSIONS } from './missions';

export interface ProgressSnapshot {
  visited: string[];
  missionsDone: string[];
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  /** Spoken when earned. `{name}` is replaced with the player's name. */
  cheer: string;
  earned: (p: ProgressSnapshot) => boolean;
}

const PACIFIC = ['CA', 'OR', 'WA', 'AK', 'HI'];
const ATLANTIC = ['ME', 'NH', 'MA', 'RI', 'CT', 'NY', 'NJ', 'DE', 'MD', 'VA', 'NC', 'SC', 'GA', 'FL'];

const count = (n: number) => (p: ProgressSnapshot) => p.visited.length >= n;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'stamps-1', icon: '🎫', title: 'First Stamp', cheer: 'Your very first passport stamp! Way to go, {name}!', earned: count(1) },
  { id: 'stamps-5', icon: '🧭', title: 'Little Explorer', cheer: 'Five states! You are a real explorer, {name}!', earned: count(5) },
  { id: 'stamps-10', icon: '🎒', title: 'Ten States', cheer: 'Ten states! Your backpack is getting full!', earned: count(10) },
  { id: 'stamps-25', icon: '🏅', title: 'Halfway Hero', cheer: 'Twenty five states! That is half of the whole country, {name}!', earned: count(25) },
  { id: 'stamps-50', icon: '🇺🇸', title: '50 States Club', cheer: 'All fifty states! {name}, you explored the whole United States! Amazing!', earned: count(50) },
  {
    id: 'coast-to-coast', icon: '🌊', title: 'Coast to Coast',
    cheer: 'You visited the Atlantic Ocean and the Pacific Ocean! Coast to coast!',
    earned: (p) => p.visited.some((c) => PACIFIC.includes(c)) && p.visited.some((c) => ATLANTIC.includes(c)),
  },
  ...REGIONS.map((r) => ({
    id: `region-${r.id}`,
    icon: r.emoji,
    title: r.badge,
    cheer: `You visited every state in ${r.name}! You earned the ${r.badge} badge!`,
    earned: (p: ProgressSnapshot) =>
      STATES.filter((s) => s.region === r.id).every((s) => p.visited.includes(s.code)),
  })),
  { id: 'missions-3', icon: '⭐', title: 'Mission Star', cheer: 'Three missions done! You are a Mission Star, {name}!', earned: (p) => p.missionsDone.length >= 3 },
  {
    id: 'missions-all', icon: '🔍', title: 'Super Detective',
    cheer: 'You finished every mission! {name}, you are a Super Detective!',
    earned: (p) => MISSIONS.every((m) => p.missionsDone.includes(m.id)),
  },
];
