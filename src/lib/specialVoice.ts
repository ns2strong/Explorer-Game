/**
 * Grown-ups' voice recordings for special places ("This is the place you were born!"),
 * kept on this device only in IndexedDB, keyed by state code. Never uploaded anywhere.
 * Every call fails soft: if storage is unavailable the game falls back to the built-in voice.
 */
const DB = 'explorer-game';
const STORE = 'special-voice';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = fn(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export async function saveVoice(code: string, blob: Blob): Promise<boolean> {
  try {
    await run('readwrite', (s) => s.put(blob, code));
    return true;
  } catch {
    return false;
  }
}

export async function loadVoice(code: string): Promise<Blob | null> {
  try {
    return ((await run('readonly', (s) => s.get(code))) as Blob | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function deleteVoice(code: string): Promise<void> {
  try {
    await run('readwrite', (s) => s.delete(code));
  } catch {
    /* nothing to delete */
  }
}

export async function clearVoices(): Promise<void> {
  try {
    await run('readwrite', (s) => s.clear());
  } catch {
    /* nothing to clear */
  }
}

/** Pick a recording format the browser supports (Safari: mp4/AAC, Chrome/Firefox: webm/opus). */
export function recorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find((t) =>
    MediaRecorder.isTypeSupported?.(t),
  );
}

export const canRecord = () =>
  typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
