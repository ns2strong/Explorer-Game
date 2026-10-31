/**
 * Maps a spoken sentence to the file name of its recording.
 * Shared by the game (to find a clip) and the voice generator (to name it).
 */
export function normalizeLine(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 32-bit FNV-1a hash of the normalized text, as 8 hex characters. */
export function clipKey(text: string): string {
  const s = normalizeLine(text);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
