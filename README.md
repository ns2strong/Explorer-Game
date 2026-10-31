# 🦊 Ava's Big Adventure

A tap-and-listen game for young explorers (built for a 4-year-old) to discover the United States —
its regions, states, animals, foods and landmarks — with Finn the fox as a talking guide.

- Tap a color to zoom into a region, then tap a state to hear a fun fact
- Hear all three picture facts on a state to earn its passport stamp; the map fills with pictures as you explore
- ⭐ Missions: "Can you find where alligators live?" with gentle hints
- Everything is narrated — no reading required

See [docs/DESIGN.md](docs/DESIGN.md) for the full design and roadmap.

## Run it on a computer

```bash
npm install
```

```bash
npm run dev
```

Then open the printed URL. Because the dev server listens on your network (`--host`), an iPad on the
same Wi-Fi can open the "Network" URL too.

## Play on the iPad from anywhere (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` publishes the game whenever `main` changes.
One-time setup: in the GitHub repo go to **Settings → Pages → Source** and choose **GitHub Actions**.
Then on the iPad, open the Pages URL in Safari, tap **Share → Add to Home Screen** for a full-screen app icon.

## Give Finn a natural voice (ElevenLabs)

Without recordings, Finn uses the device's built-in voice, which can sound robotic.
A script records every line in the game with ElevenLabs instead: about 440 lines and
30,000 characters. Each line is recorded once and saved as an MP3, so playing the game
never uses ElevenLabs credits and your API key never goes into the game.

1. Get an API key on elevenlabs.io (Profile → API Keys).
2. Pick a voice. To list the voices on your account:
   ```bash
   ELEVENLABS_API_KEY=your-key npm run voice -- --list-voices
   ```
3. Try a few lines first and listen in the game (`npm run dev`):
   ```bash
   ELEVENLABS_API_KEY=your-key npm run voice -- --voice VOICE_ID --limit 5
   ```
4. Record the rest:
   ```bash
   ELEVENLABS_API_KEY=your-key npm run voice -- --voice VOICE_ID
   ```

Clips are saved to `public/audio/` and listed in `src/audio-manifest.json`. Commit both.
Lines that were already recorded are skipped, so after editing a fact only that line is
re-recorded. Changing the voice re-records everything. Use `--dry-run` to see the
character count before spending credits. Clips are recorded with the player's name
(`--name`, default Ava); if you change the name in the game's settings, the lines that
say her name fall back to the built-in voice until you re-run with the new name.

On iPad, you can make the fallback voice better too: Settings → Accessibility →
Spoken Content → Voices → English, then download an "Enhanced" or "Premium" voice.
The game picks it up automatically.

## Grown-up settings

Press and hold the faint ⚙️ in the bottom-right corner for 2 seconds to change the player's name,
turn narration on/off, or reset progress. Progress is saved on the device only.

## Develop

```bash
npm test
```

```bash
npm run build
```

Content lives in `src/data/` — states, regions, missions and achievements are plain data,
so adding facts or missions doesn't require touching game code.
