# Ava's Big Adventure — Design Document

An educational exploration game that teaches a 4-year-old about the United States.
Version 1 covers the U.S. only; the data model is designed to extend to the world later.

## Player

| | |
|---|---|
| Player | **Ava**, age 4 — a pre-reader |
| Devices | iPad (primary, touch) and computer (mouse) |
| Session length | 2–5 minutes of focused play |
| Art budget | Free (emoji + generated shapes + public-domain map data) |

## Design pillars

1. **Audio-first, never text-dependent.** Everything important is spoken by Finn the fox. Text on screen is for grown-ups.
2. **Big targets, instant feedback.** Every tap bounces, pops, or sings. Buttons are 60–90px; tiny states get enlarged hit areas.
3. **No failure.** Wrong answers get a gentle "That's Georgia! Keep looking!" After two misses, the answer glows.
4. **Collecting is the reward.** Passport stamps, badges, and a map that fills up with pictures.
5. **Personal.** The game is "Ava's Big Adventure"; Finn greets and cheers her by name. The name lives in one setting a parent can change.

## Concept: Hybrid (free explore + missions)

- **Free explore** — always available. Tap a colored region to zoom in; tap a state to open its picture card and hear a fun fact. Each first visit earns a stamp.
- **Missions** — tap the ⭐. Finn asks a "find it" question with a big picture (🐊, 🗽, 🧤…). Finn hints which region to look in, and the answer glows after two misses.

## Structure: zoom levels

```
United States ──tap a color──▶ Region ──tap a state──▶ State card
   (6 regions)                 (zoom + intro)          (shape, 3 picture tiles, fact, capital)
```

Regions: Northeast, Southeast, Midwest, Southwest, West, and Alaska & Hawaii (the "far away" states, drawn as insets).

## Progression & rewards

| Reward | How |
|---|---|
| Passport stamp | Hear all three picture facts on a state's card (the stamp outline fills one dot per picture) |
| Map pictures | Visited states change color and show their picture on the map |
| Count badges | 1, 5, 10, 25, 50 states |
| Region badges | Visit every state in a region (e.g. "Southwest Trailblazer") |
| Coast to Coast | Visit an Atlantic and a Pacific state |
| Mission badges | 3 missions ("Mission Star"); all missions ("Super Detective") |

Deliberately excluded: timers, lives, loss-based streaks, ads, purchases, and any guilt mechanics.

## Grown-up controls

Press and hold the faint ⚙️ (bottom-right) for 2 seconds: change the name, turn narration on/off, reset progress.
Progress is stored only on the device (`localStorage`); there are no accounts and no data collection.

## Tech

- **React + TypeScript + Vite** — a static web app that runs on iPad Safari and desktop browsers; can be added to the iPad home screen.
- **Map**: `us-atlas` (public-domain Census shapes, pre-projected Albers) rendered as SVG via `d3-geo`. Zoom animates the SVG `viewBox`.
- **Voice**: pre-recorded ElevenLabs clips for every line (`npm run voice`), falling back to the browser's built-in speech for anything not yet recorded (preferring Premium/Enhanced voices). All narration is defined in `src/data/lines.ts`, so the recorder can't miss a line. iOS requires a first tap, hence the big ▶ start button.
- **Sound effects**: synthesized with Web Audio — no audio files.
- **Content as data** — `src/data/*.ts`. Adding a fact, mission, or badge is a data edit, and the `country → region → state` shape generalizes to other countries.

## Content guidelines

- Facts are 1–2 short sentences, under 140 characters, written to be heard (onomatopoeia welcome: "Snap snap!", "Vroom!").
- Prefer concrete, picturable things: animals, food, landmarks, "the biggest / first / most".
- Avoid scary or adult topics (disasters, gambling, wars).
- Each picture tile has its own `detail`: 1–2 sentences, under 160 characters, spoken when Ava taps it.

## Roadmap

**v0.1** — map, 6 regions, 50 state cards, passport, 12 missions, 14 badges, narration, parent settings.

**v0.1.1** — spoken details for all 150 picture tiles; ElevenLabs voice pipeline with built-in voice fallback.

**v0.1.2 (this build)** — all 441 lines recorded with ElevenLabs; stamps are earned by hearing all three picture facts.

**v0.2**
- State Puzzle mini-game (drag states into place)
- "Match It" mini-game (state ↔ animal/food)
- 1–3 major cities per state with landmark pictures
- Offline support (service worker)

**v0.3**
- Optional: clone a parent's voice in ElevenLabs and re-record with it
- Illustrated mascot and landmark art to replace emoji
- Ava picks her explorer outfit/vehicle (hot-air balloon, plane, car) that flies between regions
- Grown-up progress view

**Later** — "Big Explorer" mode for ages 6+ (capitals quiz, geography words), then other countries.
