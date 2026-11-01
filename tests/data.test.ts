import { describe, expect, it } from 'vitest';
import { STATES, STATE_BY_CODE } from '../src/data/states';
import { REGIONS } from '../src/data/regions';
import { MISSIONS } from '../src/data/missions';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { SHAPE_BY_FIPS, REGION_BOX } from '../src/lib/geo';
import { personalize } from '../src/lib/progress';

describe('game content', () => {
  it('has all 50 states with unique codes and FIPS ids', () => {
    expect(STATES).toHaveLength(50);
    expect(new Set(STATES.map((s) => s.code)).size).toBe(50);
    expect(new Set(STATES.map((s) => s.fips)).size).toBe(50);
  });

  it('every state has a map shape, a known region, three pictures and a fact', () => {
    const regionIds = new Set(REGIONS.map((r) => r.id));
    for (const s of STATES) {
      expect(SHAPE_BY_FIPS[s.fips], s.name).toBeDefined();
      expect(regionIds.has(s.region), s.name).toBe(true);
      expect(s.things).toHaveLength(3);
      expect(s.fact.length, s.name).toBeGreaterThan(10);
      expect(s.fact.length, `${s.name} fact is too long for a 4-year-old`).toBeLessThan(140);
    }
  });

  it('every region has states and a zoom box', () => {
    for (const r of REGIONS) {
      expect(STATES.some((s) => s.region === r.id), r.id).toBe(true);
      expect(REGION_BOX[r.id][2]).toBeGreaterThan(0);
    }
  });

  it('missions point at real states and have unique ids', () => {
    expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(MISSIONS.length);
    for (const m of MISSIONS) for (const t of m.targets) expect(STATE_BY_CODE[t], `${m.id} → ${t}`).toBeDefined();
  });

  it('achievements unlock as expected', () => {
    const none = { visited: [], missionsDone: [] };
    const all = { visited: STATES.map((s) => s.code), missionsDone: MISSIONS.map((m) => m.id) };
    expect(ACHIEVEMENTS.filter((a) => a.earned(none))).toHaveLength(0);
    expect(ACHIEVEMENTS.every((a) => a.earned(all))).toBe(true);
    const coast = ACHIEVEMENTS.find((a) => a.id === 'coast-to-coast')!;
    expect(coast.earned({ visited: ['CA', 'FL'], missionsDone: [] })).toBe(true);
    expect(coast.earned({ visited: ['CA', 'NV'], missionsDone: [] })).toBe(false);
  });

  it('personalizes narration with the player name', () => {
    expect(personalize('Great job, {name}!', 'Ava')).toBe('Great job, Ava!');
  });
});

describe('narration', () => {
  it('every picture tile has a short spoken detail', async () => {
    for (const s of STATES)
      for (const t of s.things) {
        expect(t.detail.length, `${s.name} / ${t.word}`).toBeGreaterThan(20);
        expect(t.detail.length, `${s.name} / ${t.word} detail is too long`).toBeLessThan(160);
      }
  });

  it('lists every line once, fully personalized, with unique recording keys', async () => {
    const { allLines } = await import('../src/data/lines');
    const { clipKey } = await import('../src/lib/clipKey');
    const lines = allLines('Ava');
    expect(lines.length).toBeGreaterThan(300);
    expect(lines.some((l) => l.includes('{name}'))).toBe(false);
    expect(new Set(lines.map(clipKey)).size).toBe(lines.length);
  });

  it('clip keys ignore curly vs straight apostrophes and spacing', async () => {
    const { clipKey } = await import('../src/lib/clipKey');
    expect(clipKey('That’s  Ohio!')).toBe(clipKey("That's Ohio!"));
  });
});

describe('grown-up gate', () => {
  it('asks a sum with four distinct positive choices including the answer', async () => {
    const { makeGateQuestion } = await import('../src/lib/parentGate');
    for (let i = 0; i < 500; i++) {
      const q = makeGateQuestion();
      expect(q.answer).toBe(q.a + q.b);
      expect(q.a).toBeGreaterThanOrEqual(3);
      expect(q.b).toBeLessThanOrEqual(9);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.answer);
      expect(q.choices.every((n) => n > 0)).toBe(true);
    }
  });
});

describe('special places', () => {
  it('keeps only well-formed entries for real states and trims long notes', async () => {
    const { sanitizeSpecial, NOTE_MAX } = await import('../src/lib/special');
    const out = sanitizeSpecial({
      CO: { icon: '🎂', note: '  This is the place you were born!  ' },
      XX: { icon: '❤️', note: 'not a state' },
      TX: { icon: '🏠', note: '   ' },
      FL: { note: 'x'.repeat(500) },
      NY: 'bad',
    });
    expect(Object.keys(out).sort()).toEqual(['CO', 'FL']);
    expect(out.CO).toEqual({ icon: '🎂', note: 'This is the place you were born!' });
    expect(out.FL.icon).toBe('❤️');
    expect(out.FL.note.length).toBe(NOTE_MAX);
    expect(sanitizeSpecial(null)).toEqual({});
  });
});

describe('special place recordings', () => {
  it('keeps the voice marker only when it is a valid timestamp', async () => {
    const { sanitizeSpecial } = await import('../src/lib/special');
    const out = sanitizeSpecial({
      CO: { icon: '🎂', note: 'Born here!', voice: 1730000000000 },
      TX: { icon: '🏠', note: 'Home!', voice: 'yes' },
    });
    expect(out.CO.voice).toBe(1730000000000);
    expect(out.TX.voice).toBeUndefined();
  });
});
