import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { USMap } from './components/USMap';
import { StateCard } from './components/StateCard';
import { Passport } from './components/Passport';
import { Mascot } from './components/Mascot';
import { Confetti } from './components/Confetti';
import { ParentSettings } from './components/ParentSettings';
import { STATES, STATE_BY_FIPS, STATE_BY_CODE, type Thing, type UsState } from './data/states';
import { REGION_BY_ID, type RegionId } from './data/regions';
import { MISSIONS, type Mission } from './data/missions';
import { ACHIEVEMENTS } from './data/achievements';
import { L } from './data/lines';
import { loadProgress, saveProgress, freshProgress, personalize, type Progress } from './lib/progress';
import { say, stopSpeaking, unlockSpeech, setSpeechEnabled } from './lib/speech';
import { sfx, unlockSound } from './lib/sound';

interface Celebration {
  key: number;
  icon: string;
  title: string;
  speech: string;
  /** Mission wins show right away, even over a state card. Badges wait for the card to close. */
  urgent: boolean;
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [started, setStarted] = useState(false);
  const [region, setRegion] = useState<RegionId | null>(null);
  /** The open state card. `justStamped` plays the stamp animation when the last picture fact is heard. */
  const [card, setCard] = useState<{ state: UsState; justStamped: boolean } | null>(null);
  const [passportOpen, setPassportOpen] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [misses, setMisses] = useState(0);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [line, setLine] = useState('');
  const [talking, setTalking] = useState(false);
  const [bounce, setBounce] = useState<{ fips: string; n: number } | null>(null);
  const [lastTouch, setLastTouch] = useState(() => Date.now());
  const talkId = useRef(0);
  const celebKey = useRef(0);

  const name = progress.playerName;
  const visited = useMemo(() => new Set(progress.visited), [progress.visited]);
  const earned = useMemo(() => new Set(progress.achievements), [progress.achievements]);

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => setSpeechEnabled(progress.voiceOn), [progress.voiceOn]);

  /** Finn says something: show it in the bubble and speak it. Resolves true if it played to the end. */
  const talk = useCallback(
    (text: string): Promise<boolean> => {
      const t = personalize(text, name);
      const id = ++talkId.current;
      setLine(t);
      setTalking(true);
      return say(t).then((finished) => {
        if (id === talkId.current) setTalking(false);
        return finished;
      });
    },
    [name],
  );

  const cardRef = useRef(card);
  cardRef.current = card;

  // A ref mirror so progress updates can be computed synchronously (no side effects in state updaters).
  const progressRef = useRef(progress);
  progressRef.current = progress;

  /** Apply a progress change and queue any newly-earned badges. */
  const updateProgress = useCallback((change: (p: Progress) => Progress) => {
    let next = change(progressRef.current);
    const fresh = ACHIEVEMENTS.filter((a) => !next.achievements.includes(a.id) && a.earned(next));
    if (fresh.length) {
      next = { ...next, achievements: [...next.achievements, ...fresh.map((a) => a.id)] };
      setCelebrations((q) => [
        ...q,
        ...fresh.map((a) => ({
          key: ++celebKey.current,
          icon: a.icon,
          title: a.title,
          speech: personalize(a.cheer, next.playerName),
          urgent: false,
        })),
      ]);
    }
    progressRef.current = next;
    setProgress(next);
  }, []);

  /** No stamp yet and no picture tapped: Finn explains how to earn the stamp. */
  const needsStampHint = (st: UsState) =>
    cardRef.current?.state === st &&
    !progressRef.current.visited.includes(st.code) &&
    !(progressRef.current.heard[st.code]?.length);

  const openCard = useCallback(
    (st: UsState, speak = true) => {
      setCard({ state: st, justStamped: false });
      if (speak)
        void talk(L.stateFact(st)).then((finished) => {
          if (finished && needsStampHint(st)) void talk(L.stampHint);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [talk],
  );

  /** Ava tapped a picture fact. Hearing all three earns the state's stamp. */
  const hearThing = (st: UsState, t: Thing) => {
    sfx.pop();
    const before = progressRef.current.heard[st.code] ?? [];
    const heard = before.includes(t.word) ? before : [...before, t.word];
    const earnsStamp = !progressRef.current.visited.includes(st.code) && st.things.every((x) => heard.includes(x.word));
    updateProgress((p) => ({
      ...p,
      heard: { ...p.heard, [st.code]: heard },
      visited: earnsStamp ? [...p.visited, st.code] : p.visited,
    }));
    if (earnsStamp) {
      setCard({ state: st, justStamped: true });
      setTimeout(() => sfx.stamp(), 250);
    }
    void say(L.thing(t)).then((finished) => {
      if (finished && earnsStamp && cardRef.current?.state === st) void talk(L.stampEarned);
    });
  };

  // ── Missions ────────────────────────────────────────────────
  const startMission = () => {
    sfx.pop();
    const next = MISSIONS.find((m) => !progress.missionsDone.includes(m.id)) ?? MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setMission(next);
    setMisses(0);
    setRegion(null);
    talk(next.ask);
  };

  const cancelMission = () => {
    setMission(null);
    setMisses(0);
    talk(L.stopMission);
  };

  const winMission = (m: Mission, st: UsState) => {
    setMission(null);
    setMisses(0);
    openCard(st, false);
    updateProgress((p) => (p.missionsDone.includes(m.id) ? p : { ...p, missionsDone: [...p.missionsDone, m.id] }));
    setCelebrations((q) => [
      { key: ++celebKey.current, icon: m.icon, title: st.name, speech: personalize(m.cheer, name), urgent: true },
      ...q,
    ]);
  };

  const missionRegions = useMemo(
    () => new Set(mission?.targets.map((c) => STATE_BY_CODE[c].region) ?? []),
    [mission],
  );

  // ── Map taps ────────────────────────────────────────────────
  const zoomTo = (r: RegionId) => {
    sfx.zoom();
    setRegion(r);
    const reg = REGION_BY_ID[r];
    if (!mission) return talk(reg.intro);
    if (missionRegions.has(r)) return talk(L.regionGood(reg));
    setMisses((n) => n + 1);
    talk(L.regionWrong(reg));
  };

  const handleTap = (fips: string) => {
    const st = STATE_BY_FIPS[fips];
    if (!st) return;
    setLastTouch(Date.now());
    setBounce({ fips, n: Date.now() });
    sfx.pop();

    if (region !== st.region) return zoomTo(st.region);

    if (mission) {
      if (mission.targets.includes(st.code)) return winMission(mission, st);
      setMisses((n) => n + 1);
      sfx.hmm();
      return talk(L.wrongState(st));
    }
    openCard(st);
  };

  const goHome = () => {
    setLastTouch(Date.now());
    if (region === null) return;
    sfx.zoom();
    setRegion(null);
    talk(mission ? mission.ask : L.home);
  };

  // Hints: after two misses, gently glow the answer (or its region).
  const glow = useMemo(() => {
    if (!mission || misses < 2) return new Set<string>();
    const targets = mission.targets.map((c) => STATE_BY_CODE[c]);
    if (region === null) return new Set(STATES.filter((s) => missionRegions.has(s.region)).map((s) => s.fips));
    return new Set(targets.filter((s) => s.region === region).map((s) => s.fips));
  }, [mission, misses, region, missionRegions]);

  const wrongRegion = mission !== null && region !== null && !missionRegions.has(region);

  // ── Celebrations ────────────────────────────────────────────
  const current = celebrations[0];
  const showCelebration = current && (current.urgent || (!card && !passportOpen));

  useEffect(() => {
    if (!showCelebration) return;
    sfx.fanfare();
    const t = setTimeout(() => talk(current.speech), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCelebration, current?.key]);

  const dismissCelebration = () => {
    if (celebrations.length === 1 && current?.urgent) {
      // After a mission win the state card is open: explain the stamp if it isn't earned yet.
      const st = cardRef.current?.state;
      setTimeout(() => void talk(st && needsStampHint(st) ? L.stampHint : L.anotherMission), 200);
    }
    setCelebrations((q) => q.slice(1));
  };

  // ── Idle nudge ─────────────────────────────────────────────
  useEffect(() => {
    if (!started || card || passportOpen || showCelebration) return;
    const t = setTimeout(() => {
      const hint = mission ? mission.ask : L.idleHints[Math.floor(Math.random() * L.idleHints.length)];
      talk(hint);
      setLastTouch(Date.now());
    }, 30000);
    return () => clearTimeout(t);
  }, [started, card, passportOpen, showCelebration, mission, lastTouch, talk]);

  // ── Start screen ────────────────────────────────────────────
  const play = () => {
    unlockSpeech();
    unlockSound();
    sfx.fanfare();
    setStarted(true);
    setLastTouch(Date.now());
    talk(progress.visited.length === 0 ? L.greetNew : L.welcomeBack);
  };

  if (!started) {
    return (
      <div className="start">
        <div className="start-sky" aria-hidden="true">
          <span className="cloud c1">☁️</span>
          <span className="cloud c2">☁️</span>
          <span className="balloon">🎈</span>
        </div>
        <h1 className="start-title">
          {name}’s<br />
          Big Adventure
        </h1>
        <div className="start-fox" aria-hidden="true">
          🦊
        </div>
        <button className="play-btn" onClick={play} aria-label="Play">
          ▶
        </button>
        <p className="start-sub">Explore the United States with Finn the fox</p>
      </div>
    );
  }

  const regionInfo = region ? REGION_BY_ID[region] : null;

  return (
    <div className="app" onPointerDown={() => setLastTouch(Date.now())}>
      <header className="topbar">
        <button
          className={`round-btn home ${region === null ? 'faded' : ''} ${wrongRegion ? 'pulse' : ''}`}
          onClick={goHome}
          aria-label="Whole map"
        >
          🏠
        </button>

        <button
          className="title-pill"
          style={regionInfo ? { background: regionInfo.color, borderColor: regionInfo.deep } : undefined}
          onClick={() => (regionInfo ? talk(regionInfo.intro) : talk(L.usa))}
        >
          {regionInfo ? `${regionInfo.emoji} ${regionInfo.name}` : '🇺🇸 United States'}
        </button>

        <div className="topbar-right">
          <button className={`round-btn star ${mission ? 'active' : ''}`} onClick={mission ? () => talk(mission.ask) : startMission} aria-label="Mission">
            ⭐
          </button>
          <button
            className="round-btn passport-btn"
            onClick={() => {
              sfx.pop();
              setPassportOpen(true);
              talk(L.passport(progress.visited.length));
            }}
            aria-label="Passport"
          >
            📘<span className="count">{progress.visited.length}</span>
          </button>
        </div>
      </header>

      {mission && (
        <div className="mission-banner pop-in">
          <button className="mission-icon" onClick={() => talk(mission.ask)} aria-label="Hear the mission again">
            {mission.icon}
          </button>
          <span className="mission-q">Find it!</span>
          <button className="round-btn small" onClick={cancelMission} aria-label="Stop mission">
            ✖️
          </button>
        </div>
      )}

      <main className="map-wrap">
        <USMap region={region} visited={visited} glow={glow} bounce={bounce} onTap={handleTap} />
      </main>

      <Mascot line={line} talking={talking} />

      <ParentSettings
        playerName={name}
        voiceOn={progress.voiceOn}
        onSave={(n, v) => setProgress((p) => ({ ...p, playerName: n, voiceOn: v }))}
        onReset={() => {
          stopSpeaking();
          setProgress((p) => ({ ...freshProgress(p.playerName), voiceOn: p.voiceOn }));
          setCelebrations([]);
          setMission(null);
          setRegion(null);
        }}
      />

      {card && (
        <StateCard
          state={card.state}
          heard={new Set(progress.heard[card.state.code] ?? [])}
          stamped={visited.has(card.state.code)}
          justStamped={card.justStamped}
          onPick={(t) => hearThing(card.state, t)}
          onClose={() => {
            sfx.pop();
            setCard(null);
            stopSpeaking();
            setTalking(false);
          }}
        />
      )}

      {passportOpen && (
        <Passport
          playerName={name}
          visited={visited}
          earned={earned}
          onClose={() => {
            sfx.pop();
            setPassportOpen(false);
            stopSpeaking();
            setTalking(false);
          }}
        />
      )}

      {showCelebration && (
        <div className="overlay celebrate" onClick={dismissCelebration}>
          <Confetti key={current.key} extra={current.icon} />
          <div className="celebrate-box pop-in">
            <div className="celebrate-icon">{current.icon}</div>
            <div className="celebrate-title">{current.title}</div>
            <button className="play-btn small" aria-label="Yay! Continue">
              👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
