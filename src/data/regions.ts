export type RegionId =
  | 'northeast'
  | 'southeast'
  | 'midwest'
  | 'southwest'
  | 'west'
  | 'faraway';

export interface Region {
  id: RegionId;
  name: string;
  /** Fill color for the region's states on the map. */
  color: string;
  /** Darker shade for outlines, badges and highlights. */
  deep: string;
  emoji: string;
  /** Spoken when Ava zooms into the region. */
  intro: string;
  /** Name of the badge earned for visiting every state in the region. */
  badge: string;
}

export const REGIONS: Region[] = [
  {
    id: 'northeast',
    name: 'The Northeast',
    color: '#ffb4a2',
    deep: '#e5383b',
    emoji: '🍁',
    intro:
      'The Northeast! It has big cities, lighthouses by the ocean, and trees that turn red and orange in the fall.',
    badge: 'Northeast Navigator',
  },
  {
    id: 'southeast',
    name: 'The Southeast',
    color: '#a8e6cf',
    deep: '#2a9d8f',
    emoji: '🐊',
    intro:
      'The Southeast! It is warm here, with sunny beaches, swamps, and alligators. Snap snap!',
    badge: 'Southeast Scout',
  },
  {
    id: 'midwest',
    name: 'The Midwest',
    color: '#ffe08a',
    deep: '#e09f3e',
    emoji: '🌽',
    intro:
      'The Midwest! It has giant farms with lots of corn, and huge lakes called the Great Lakes.',
    badge: 'Midwest Pathfinder',
  },
  {
    id: 'southwest',
    name: 'The Southwest',
    color: '#ffc6e0',
    deep: '#d6336c',
    emoji: '🌵',
    intro:
      'The Southwest! It is hot and dry, with deserts, tall cactuses, and the Grand Canyon.',
    badge: 'Southwest Trailblazer',
  },
  {
    id: 'west',
    name: 'The West',
    color: '#b8c0ff',
    deep: '#5a54d6',
    emoji: '🏔️',
    intro:
      'The West! It has tall mountains, giant trees, and the big Pacific Ocean.',
    badge: 'Mountain Explorer',
  },
  {
    id: 'faraway',
    name: 'Alaska and Hawaii',
    color: '#9be7ff',
    deep: '#1c7ed6',
    emoji: '🌋',
    intro:
      'Alaska and Hawaii are far away from the other states! Alaska is way up north where it is cold, and Hawaii is warm islands in the middle of the ocean.',
    badge: 'Faraway Adventurer',
  },
];

export const REGION_BY_ID: Record<RegionId, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
) as Record<RegionId, Region>;
