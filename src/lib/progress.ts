/**
 * Progress is saved on this device only (no accounts, no data collection).
 */

export interface Progress {
  playerName: string;
  /** States with a passport stamp (all picture facts heard). */
  visited: string[];
  /** Picture facts heard so far, by state code → tile words. */
  heard: Record<string, string[]>;
  missionsDone: string[];
  achievements: string[];
  voiceOn: boolean;
}

export const DEFAULT_PLAYER_NAME = 'Ava';
const KEY = 'explorer-game:progress:v1';

export const freshProgress = (playerName = DEFAULT_PLAYER_NAME): Progress => ({
  playerName,
  visited: [],
  heard: {},
  missionsDone: [],
  achievements: [],
  voiceOn: true,
});

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...freshProgress(), ...parsed };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable (private mode) — the game still works, it just won't remember */
  }
}

/** Replace `{name}` placeholders in narration with the player's name. */
export const personalize = (text: string, name: string) =>
  text.replace(/\{name\}/g, name || 'Explorer');
