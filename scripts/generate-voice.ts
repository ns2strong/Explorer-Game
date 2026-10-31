/**
 * Records every line Finn says using ElevenLabs, so the game has a natural voice.
 *
 *   ELEVENLABS_API_KEY=... npm run voice -- --dry-run      # count lines & characters, no API calls
 *   ELEVENLABS_API_KEY=... npm run voice -- --list-voices  # show voices on your account
 *   ELEVENLABS_API_KEY=... npm run voice                   # record missing lines
 *
 * Options:
 *   --voice <id>    ElevenLabs voice id (or ELEVENLABS_VOICE_ID)
 *   --model <id>    model id (default eleven_multilingual_v2, or ELEVENLABS_MODEL_ID)
 *   --name <name>   player name to record (default: Ava)
 *   --force         re-record everything (e.g. after changing voice)
 *   --limit <n>     record at most n new lines (handy for a quick test)
 *
 * Clips go to public/audio/<key>.mp3 and are listed in src/audio-manifest.json.
 * Already-recorded lines are skipped, so editing one fact only re-records that one line.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { allLines } from '../src/data/lines';
import { clipKey, normalizeLine } from '../src/lib/clipKey';
import { DEFAULT_PLAYER_NAME } from '../src/lib/progress';

const API = 'https://api.elevenlabs.io/v1';
const AUDIO_DIR = 'public/audio';
const MANIFEST = 'src/audio-manifest.json';
const SCRIPT_FILE = join(AUDIO_DIR, 'script.json');

const args = process.argv.slice(2);
const flag = (f: string) => args.includes(f);
const opt = (f: string) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

const apiKey = process.env.ELEVENLABS_API_KEY;
// Default: "Matilda", a warm, friendly premade voice. Pick your own with --list-voices.
const voiceId = opt('--voice') ?? process.env.ELEVENLABS_VOICE_ID ?? 'XrExE9yKIg1WjnnlVkGX';
const modelId = opt('--model') ?? process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';
const playerName = opt('--name') ?? DEFAULT_PLAYER_NAME;
const limit = Number(opt('--limit') ?? Infinity);

interface Manifest {
  voiceId: string | null;
  modelId: string | null;
  playerName: string | null;
  clips: Record<string, string>;
}

async function listVoices() {
  const res = await fetch(`${API}/voices`, { headers: { 'xi-api-key': apiKey! } });
  if (!res.ok) throw new Error(`Listing voices failed: ${res.status} ${await res.text()}`);
  const { voices } = (await res.json()) as { voices: { voice_id: string; name: string; labels?: Record<string, string> }[] };
  for (const v of voices) {
    const labels = Object.values(v.labels ?? {}).join(', ');
    console.log(`${v.voice_id}  ${v.name}${labels ? `  (${labels})` : ''}`);
  }
}

async function record(text: string, outFile: string) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey!, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: modelId,
        // Fairly stable, warm and expressive: good for a storyteller talking to a small child.
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 0.92 },
      }),
    });
    if (res.ok) {
      writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
      return;
    }
    const body = await res.text();
    if (res.status === 429 || res.status >= 500) {
      const wait = 2000 * attempt;
      console.warn(`  ${res.status}, retrying in ${wait / 1000}s…`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`ElevenLabs error ${res.status}: ${body}`);
  }
  throw new Error('ElevenLabs kept failing; try again later.');
}

async function main() {
  const lines = allLines(playerName).map(normalizeLine);
  const chars = lines.reduce((n, l) => n + l.length, 0);

  const old: Manifest = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
    : { voiceId: null, modelId: null, playerName: null, clips: {} };
  const sameVoice = old.voiceId === voiceId && old.modelId === modelId;
  const force = flag('--force') || (!sameVoice && Object.keys(old.clips).length > 0);
  if (!sameVoice && Object.keys(old.clips).length > 0 && !flag('--force')) {
    console.log('Voice or model changed since the last run, so every line will be re-recorded.');
  }

  // A clip counts as done if its file exists, even if an interrupted run never listed it.
  const todo = lines.filter((l) => force || !existsSync(join(AUDIO_DIR, `${clipKey(l)}.mp3`)));
  const todoChars = todo.reduce((n, l) => n + l.length, 0);

  console.log(`Player name: ${playerName}`);
  console.log(`Voice: ${voiceId}   Model: ${modelId}`);
  console.log(`${lines.length} lines in the game (${chars.toLocaleString()} characters).`);
  console.log(`${todo.length} need recording (${todoChars.toLocaleString()} characters of ElevenLabs credit).`);

  if (flag('--dry-run')) return;
  if (!apiKey) {
    console.error('\nSet ELEVENLABS_API_KEY first (Profile → API Keys on elevenlabs.io).');
    process.exit(1);
  }
  if (flag('--list-voices')) return listVoices();

  mkdirSync(AUDIO_DIR, { recursive: true });
  const clips: Record<string, string> = {};
  for (const l of lines) {
    const key = clipKey(l);
    if (!force && existsSync(join(AUDIO_DIR, `${key}.mp3`))) clips[key] = `audio/${key}.mp3`;
  }

  const save = () => {
    const manifest: Manifest = { voiceId, modelId, playerName, clips };
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
    const script = Object.fromEntries(lines.map((l) => [clipKey(l), l]));
    writeFileSync(SCRIPT_FILE, JSON.stringify(script, null, 2) + '\n');
  };

  let done = 0;
  try {
    for (const line of todo.slice(0, limit)) {
      const key = clipKey(line);
      const file = join(AUDIO_DIR, `${key}.mp3`);
      process.stdout.write(`[${++done}/${Math.min(todo.length, limit)}] ${line.slice(0, 70)}… `);
      await record(line, file);
      clips[key] = `audio/${key}.mp3`;
      console.log('✓');
    }
  } finally {
    save(); // keep everything recorded so far, even if ElevenLabs stops us (e.g. out of credits)
  }

  // Remove recordings for lines that no longer exist (e.g. an edited fact).
  const keep = new Set(Object.keys(clips).map((k) => `${k}.mp3`));
  for (const f of readdirSync(AUDIO_DIR)) {
    if (f.endsWith('.mp3') && !keep.has(f)) unlinkSync(join(AUDIO_DIR, f));
  }
  console.log(`\nDone. ${Object.keys(clips).length} clips ready. Rebuild the game to include them.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  if (e instanceof TypeError && /fetch failed/i.test(e.message) && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
    console.error('\nNode could not reach ElevenLabs. Behind a proxy, run with NODE_USE_ENV_PROXY=1 (Node 22.21 or newer).');
  }
  if (/quota_exceeded/.test(String(e))) {
    console.error('\nOut of ElevenLabs credits. Everything recorded so far is saved; run this again after adding credits to continue.');
  }
  if (/voices_read/.test(String(e))) {
    console.error('\nThis API key is restricted. Enable "Voices: Read" for it on elevenlabs.io, or find voice ids in the Voice Library instead.');
  }
  process.exit(1);
});
