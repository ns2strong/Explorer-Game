/**
 * "Special places": states that mean something to the player (where she was born,
 * where Grandma lives…), entered by a grown-up in the settings.
 *
 * Stored on this device only, under its own key, so they never go into the code or
 * the public website, and "Start over" (which resets progress) leaves them alone.
 */
import { STATE_BY_CODE } from '../data/states';

export interface SpecialPlace {
  /** Picture shown on the heart tile, e.g. ❤️ 🏠 🎂. */
  icon: string;
  /** The message read aloud, e.g. "This is the place you were born!" */
  note: string;
  /** Set when a grown-up recorded the message (the time it was recorded); the audio lives in IndexedDB. */
  voice?: number;
}

/** State code → special place. */
export type SpecialPlaces = Record<string, SpecialPlace>;

export const SPECIAL_ICONS = ['❤️', '🏠', '🎂', '👶', '👵', '👴', '👨‍👩‍👧', '🐶', '🐱', '🏖️', '⛰️', '🎡', '⭐'];
export const NOTE_MAX = 140;

const KEY = 'explorer-game:special:v1';

/** Keep only well-formed entries for real states (storage may hold anything). */
export function sanitizeSpecial(raw: unknown): SpecialPlaces {
  if (!raw || typeof raw !== 'object') return {};
  const out: SpecialPlaces = {};
  for (const [code, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!STATE_BY_CODE[code] || !value || typeof value !== 'object') continue;
    const { icon, note, voice } = value as Partial<SpecialPlace>;
    if (typeof note !== 'string' || !note.trim()) continue;
    out[code] = {
      icon: typeof icon === 'string' && icon ? icon : '❤️',
      note: note.trim().slice(0, NOTE_MAX),
      ...(typeof voice === 'number' && voice > 0 ? { voice } : {}),
    };
  }
  return out;
}

export function loadSpecial(): SpecialPlaces {
  try {
    return sanitizeSpecial(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
  } catch {
    return {};
  }
}

export function saveSpecial(places: SpecialPlaces) {
  try {
    localStorage.setItem(KEY, JSON.stringify(places));
  } catch {
    /* storage unavailable: kept for this session only */
  }
}
