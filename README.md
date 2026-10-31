# 🦊 Ava's Big Adventure

A tap-and-listen game for young explorers (built for a 4-year-old) to discover the United States —
its regions, states, animals, foods and landmarks — with Finn the fox as a talking guide.

- Tap a color to zoom into a region, then tap a state to hear a fun fact
- Collect passport stamps and badges; the map fills with pictures as you explore
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
