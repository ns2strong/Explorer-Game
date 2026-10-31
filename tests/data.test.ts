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
