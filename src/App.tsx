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
import { loadSpecial, saveSpecial, type SpecialPlaces } from './lib/special';
import { loadVoice } from './lib/specialVoice';

const NONE: Set<string> = new Set();

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
  /** Grown-up-entered special places: saved separately from progress, so starting over keeps them. */
  const [special, setSpecial] = useState<SpecialPlaces>(loadSpecial);
  const [started, setStarted] = useState(false);
  const [region, setRegion] = useState<RegionId | null>(null);
  /** The open state card. `justStamped` plays the stamp animation when the last picture fact is heard. */
  const [card, setCard] = useState<{ state: UsState; justStamped: boolean } | null>(null);
  const [passportOpen, setPassportOpen] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [misses, setMisses] = useState(0);
  /** During a mission: states (FIPS) Ava already tried that aren't the answer. They grey out and can't be tapped again. */
  const [ruledOut, setRuledOut] = useState<Set<string>>(() => new Set());
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [line, setLine] = useState('');
  const [talking, setTalking] = useState(false);
  const [bounce, setBounce] = useState<{ fips: string; n: number } | null>(null);
  const [lastTouch, setLastTouch] = useState(() => Date.now());
  /** A fact is playing: Ava can't move on until it finishes. `nudge` counts taps made meanwhile. */
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(0);
  const busyRef = useRef(false);
  const talkId = useRef(0);
  const celebKey = useRef(0);

  const name = progress.playerName;
  const visited = useMemo(() => new Set(progress.visited), [progress.visited]);
  const earned = useMemo(() => new Set(progress.achievements), [progress.achievements]);

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => saveSpecial(special), [special]);
  const specialRef = useRef(special);
  specialRef.current = special;
  const specialCodes = useMemo(() => new Set(Object.keys(special)), [special]);

  /** Playable URLs for grown-ups' recordings, by state code. Reloaded when a recording changes. */
  const [specialVoices, setSpecialVoices] = useState<Record<string, string>>({});
  const voiceKey = Object.entries(special)
    .filter(([, p]) => p.voice)
    .map(([c, p]) => `${c}:${p.voice}`)
    .join(',');
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    void (async () => {
      const out: Record<string, string> = {};
      for (const pair of voiceKey ? voiceKey.split(',') : []) {
        const code = pair.split(':')[0];
        const blob = await loadVoice(code);
        if (blob) urls.push((out[code] = URL.createObjectURL(blob)));
      }
      if (cancelled) urls.forEach((u) => URL.revokeObjectURL(u));
      else setSpecialVoices(out);
    })();
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [voiceKey]);
  useEffect(() => setSpeechEnabled(progress.voiceOn), [progress.voiceOn]);

  /** Finn says something: show it in the bubble and speak it. Resolves true if it played to the end. */
  const talk = useCallback(
    (text: string, clipUrl?: string): Promise<boolean> => {
      const t = personalize(text, name);
      const id = ++talkId.current;
      setLine(t);
      setTalking(true);
      return say(t, clipUrl).then((finished) => {
        if (id === talkId.current) setTalking(false);
        return finished;
      });
    },
    [name],
  );

  const cardRef = useRef(card);
  cardRef.current = card;

  const setBusyBoth = (b: boolean) => {
    busyRef.current = b;
    setBusy(b);
  };

  /**
   * Speak a fact that must play to the end: until it finishes, taps that would move on are
   * ignored. Resolves true when it finished. If audio stalls, a time limit based on the
   * length of the line unlocks the game (and counts it as heard) so Ava never gets stuck.
   */
  const narrate = useCallback(
    (text: string, clipUrl?: string): Promise<boolean> => {
      setBusyBoth(true);
      const limit = 2500 + text.length * 100;
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (finished: boolean) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          setBusyBoth(false);
          resolve(finished);
        };
        const timer = setTimeout(() => finish(true), limit);
        void talk(text, clipUrl).then(finish);
      });
    },
    [talk],
  );

  /** Run `fn` only if no fact is playing; otherwise nudge Ava back to the fact. */
  const ifFree = <A extends unknown[], R>(fn: (...a: A) => R) =>
    (...a: A): R | false => {
      if (busyRef.current) {
        setNudge((n) => n + 1);
        return false;
      }
      return fn(...a);
    };

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
        void narrate(L.stateFact(st)).then((finished) => {
          if (!finished || cardRef.current?.state !== st) return;
          if (specialRef.current[st.code]) void talk(L.specialHint);
          else if (needsStampHint(st)) void talk(L.stampHint);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [talk, narrate],
  );

  /**
   * Ava tapped a picture. Its fact plays to the end; only then does it count as heard.
   * Hearing all three earns the state's stamp. Returns false if another fact is still playing.
   */
  const hearThing = ifFree((st: UsState, t: Thing): boolean => {
    sfx.pop();
    void narrate(L.thing(t)).then((finished) => {
      if (!finished) return;
      const before = progressRef.current.heard[st.code] ?? [];
      const heard = before.includes(t.word) ? before : [...before, t.word];
      const earnsStamp = !progressRef.current.visited.includes(st.code) && st.things.every((x) => heard.includes(x.word));
      updateProgress((p) => ({
        ...p,
        heard: { ...p.heard, [st.code]: heard },
        visited: earnsStamp ? [...p.visited, st.code] : p.visited,
      }));
      if (earnsStamp && cardRef.current?.state === st) {
        setCard({ state: st, justStamped: true });
        setTimeout(() => sfx.stamp(), 150);
        setTimeout(() => void talk(L.stampEarned), 700);
      }
    });
    return true;
  });

  /** Replay a fact from a card or the passport (also locked until it finishes). */
  const replayFact = ifFree((text: string, clipUrl?: string): boolean => {
    sfx.pop();
    void narrate(text, clipUrl);
    return true;
  });

  // ── Missions ────────────────────────────────────────────────
  const startMission = () => {
    sfx.pop();
    const next = MISSIONS.find((m) => !progress.missionsDone.includes(m.id)) ?? MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setMission(next);
    setMisses(0);
    setRuledOut(new Set());
    setRegion(null);
    talk(next.ask);
  };

  const cancelMission = () => {
    setMission(null);
    setMisses(0);
    setRuledOut(new Set());
    talk(L.stopMission);
  };

  const winMission = (m: Mission, st: UsState) => {
    setMission(null);
    setMisses(0);
    setRuledOut(new Set());
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

  /** Grey out states so Ava can't pick them again during this mission. */
  const ruleOut = (fipsList: string[]) => setRuledOut((prev) => new Set([...prev, ...fipsList]));

  // ── Map taps ────────────────────────────────────────────────
  const zoomTo = (r: RegionId) => {
    const reg = REGION_BY_ID[r];
    if (mission && !missionRegions.has(r)) {
      // Wrong region: don't go in. The whole region greys out so she looks somewhere else.
      setMisses((n) => n + 1);
      ruleOut(STATES.filter((s) => s.region === r).map((s) => s.fips));
      sfx.hmm();
      return talk(L.regionWrong(reg));
    }
    sfx.zoom();
    setRegion(r);
    if (!mission) return talk(reg.intro);
    talk(L.regionGood(reg));
  };

  const handleTap = ifFree((fips: string) => {
    const st = STATE_BY_FIPS[fips];
    if (!st || (mission && ruledOut.has(fips))) return;
    setLastTouch(Date.now());
    setBounce({ fips, n: Date.now() });
    sfx.pop();

    if (region !== st.region) return zoomTo(st.region);

    if (mission) {
      if (mission.targets.includes(st.code)) return winMission(mission, st);
      setMisses((n) => n + 1);
      ruleOut([fips]);
      sfx.hmm();
      return talk(L.wrongState(st));
    }
    openCard(st);
  });

  const goHome = ifFree(() => {
    setLastTouch(Date.now());
    if (region === null) return;
    sfx.zoom();
    setRegion(null);
    talk(mission ? mission.ask : L.home);
  });

  // Hints: after two misses, gently glow the answer (or its region).
  const glow = useMemo(() => {
    if (!mission || misses < 2) return new Set<string>();
    const targets = mission.targets.map((c) => STATE_BY_CODE[c]);
    if (region === null) return new Set(STATES.filter((s) => missionRegions.has(s.region)).map((s) => s.fips));
    return new Set(targets.filter((s) => s.region === region).map((s) => s.fips));
  }, [mission, misses, region, missionRegions]);


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
      const next = st && specialRef.current[st.code] ? L.specialHint : st && needsStampHint(st) ? L.stampHint : L.anotherMission;
      setTimeout(() => void talk(next), 200);
    }
    setCelebrations((q) => q.slice(1));
  };

  // ── Idle nudge ─────────────────────────────────────────────
  useEffect(() => {
    if (!started || card || passportOpen || showCelebration || busy) return;
    const t = setTimeout(() => {
      const hint = mission ? mission.ask : L.idleHints[Math.floor(Math.random() * L.idleHints.length)];
      talk(hint);
      setLastTouch(Date.now());
    }, 30000);
    return () => clearTimeout(t);
  }, [started, card, passportOpen, showCelebration, busy, mission, lastTouch, talk]);

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
          className={`round-btn home ${region === null ? 'faded' : ''}`}
          onClick={goHome}
          aria-label="Whole map"
        >
          🏠
        </button>

        <button
          className="title-pill"
          style={regionInfo ? { background: regionInfo.color, borderColor: regionInfo.deep } : undefined}
          onClick={ifFree(() => (regionInfo ? talk(regionInfo.intro) : talk(L.usa)))}
        >
          {regionInfo ? `${regionInfo.emoji} ${regionInfo.name}` : '🇺🇸 United States'}
        </button>

        <div className="topbar-right">
          <button className={`round-btn star ${mission ? 'active' : ''}`} onClick={ifFree(mission ? () => talk(mission.ask) : startMission)} aria-label="Mission">
            ⭐
          </button>
          <button
            className="round-btn passport-btn"
            onClick={ifFree(() => {
              sfx.pop();
              setPassportOpen(true);
              talk(L.passport(progress.visited.length));
            })}
            aria-label="Passport"
          >
            📘<span className="count">{progress.visited.length}</span>
          </button>
        </div>
      </header>

      {mission && (
        <div className="mission-banner pop-in">
          <button className="mission-icon" onClick={ifFree(() => talk(mission.ask))} aria-label="Hear the mission again">
            {mission.icon}
          </button>
          <span className="mission-q">Find it!</span>
          <button className="round-btn small" onClick={ifFree(cancelMission)} aria-label="Stop mission">
            ✖️
          </button>
        </div>
      )}

      <main className="map-wrap">
        <USMap region={region} visited={visited} glow={glow} ruledOut={mission ? ruledOut : NONE} special={specialCodes} bounce={bounce} onTap={handleTap} />
      </main>

      <Mascot line={line} talking={talking} onReplay={ifFree(() => line && void narrate(line))} />

      <ParentSettings
        playerName={name}
        voiceOn={progress.voiceOn}
        onSave={(n, v) => setProgress((p) => ({ ...p, playerName: n, voiceOn: v }))}
        special={special}
        onSpecialChange={setSpecial}
        onReset={() => {
          stopSpeaking();
          setBusyBoth(false);
          setProgress((p) => ({ ...freshProgress(p.playerName), voiceOn: p.voiceOn }));
          setCelebrations([]);
          setMission(null);
          setRuledOut(new Set());
          setRegion(null);
        }}
      />

      {card && (
        <StateCard
          state={card.state}
          heard={new Set(progress.heard[card.state.code] ?? [])}
          stamped={visited.has(card.state.code)}
          justStamped={card.justStamped}
          busy={busy}
          nudge={nudge}
          onPick={(t) => hearThing(card.state, t) === true}
          onFact={() => replayFact(L.stateFact(card.state)) === true}
          onCapital={() => replayFact(L.capital(card.state)) === true}
          special={special[card.state.code]}
          onSpecial={() =>
            replayFact(personalize(special[card.state.code]?.note ?? '', name), specialVoices[card.state.code]) === true
          }
          onClose={ifFree(() => {
            sfx.pop();
            setCard(null);
            stopSpeaking();
            setTalking(false);
          })}
        />
      )}

      {passportOpen && (
        <Passport
          playerName={name}
          visited={visited}
          earned={earned}
          special={specialCodes}
          busy={busy}
          speak={(text) => void replayFact(text)}
          onClose={ifFree(() => {
            sfx.pop();
            setPassportOpen(false);
            stopSpeaking();
            setTalking(false);
          })}
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
