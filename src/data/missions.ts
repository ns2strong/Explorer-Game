/**
 * Missions are "find it" challenges. Finn the fox asks a question out loud
 * and shows a big picture; Ava finds the state on the map.
 * Any state in `targets` counts as a correct answer.
 */
export interface Mission {
  id: string;
  /** Big picture shown on the mission banner (non-readers rely on this). */
  icon: string;
  /** Spoken by Finn. `{name}` is replaced with the player's name. */
  ask: string;
  /** Spoken on success. */
  cheer: string;
  targets: string[];
}

export const MISSIONS: Mission[] = [
  {
    id: 'alligator',
    icon: '🐊',
    ask: '{name}, can you find a state where alligators live? Look in the warm Southeast!',
    cheer: 'Snap snap! You found the alligators!',
    targets: ['FL', 'LA'],
  },
  {
    id: 'liberty',
    icon: '🗽',
    ask: 'Can you find the Statue of Liberty? She lives in the Northeast!',
    cheer: 'Hooray! The Statue of Liberty is in New York!',
    targets: ['NY'],
  },
  {
    id: 'biggest',
    icon: '🐻',
    ask: '{name}, can you find the biggest state of all? It is far, far away, way up north!',
    cheer: 'Wow! Alaska is the biggest state!',
    targets: ['AK'],
  },
  {
    id: 'volcano',
    icon: '🌋',
    ask: 'Can you find the islands with volcanoes, out in the ocean?',
    cheer: 'Aloha! You found Hawaii!',
    targets: ['HI'],
  },
  {
    id: 'mitten',
    icon: '🧤',
    ask: 'Can you find the state shaped like a mitten? Look near the big lakes in the Midwest!',
    cheer: 'Yes! Michigan looks just like a mitten!',
    targets: ['MI'],
  },
  {
    id: 'canyon',
    icon: '🏞️',
    ask: '{name}, can you find the Grand Canyon? It is in the hot, dry Southwest!',
    cheer: 'You found the Grand Canyon in Arizona!',
    targets: ['AZ'],
  },
  {
    id: 'peach',
    icon: '🍑',
    ask: 'Can you find the Peach State? It is in the Southeast!',
    cheer: 'Yum! Georgia is the Peach State!',
    targets: ['GA'],
  },
  {
    id: 'bridge',
    icon: '🌉',
    ask: 'Can you find the Golden Gate Bridge? It is in the West, by the ocean!',
    cheer: 'Great job! The Golden Gate Bridge is in California!',
    targets: ['CA'],
  },
  {
    id: 'cheese',
    icon: '🧀',
    ask: 'Can you find the state that makes lots of cheese? It is in the Midwest!',
    cheer: 'Say cheese! You found Wisconsin!',
    targets: ['WI'],
  },
  {
    id: 'cowboy',
    icon: '🤠',
    ask: '{name}, can you find the giant cowboy state? It is in the Southwest!',
    cheer: 'Yee-haw! You found Texas!',
    targets: ['TX'],
  },
  {
    id: 'smallest',
    icon: '🐔',
    ask: 'Can you find the smallest state? It is tiny, in the Northeast by the ocean!',
    cheer: 'You found tiny Rhode Island! Great looking!',
    targets: ['RI'],
  },
  {
    id: 'dino',
    icon: '🦖',
    ask: 'Roar! Can you find where the first T. rex bones were found? Look in the West, in the mountains!',
    cheer: 'Roar! You found Montana!',
    targets: ['MT'],
  },
];

export const MISSION_BY_ID: Record<string, Mission> = Object.fromEntries(
  MISSIONS.map((m) => [m.id, m]),
);
