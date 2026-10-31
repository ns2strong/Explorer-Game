import { useEffect, useRef, useState } from 'react';
import { makeGateQuestion, type GateQuestion } from '../lib/parentGate';

interface Props {
  playerName: string;
  voiceOn: boolean;
  onSave: (name: string, voiceOn: boolean) => void;
  onReset: () => void;
}

const GEAR_HOLD_MS = 2000;
const ERASE_HOLD_MS = 3000;

/**
 * Grown-up settings, behind three deliberate steps so a 4-year-old can't wander in:
 *   1. press and hold the faint gear for 2 seconds,
 *   2. answer an addition question (Ava can't read or solve it yet),
 *   3. to erase progress, press and hold the erase button for 3 seconds.
 */
export function ParentSettings({ playerName, voiceOn, onSave, onReset }: Props) {
  const [step, setStep] = useState<'closed' | 'gate' | 'open'>('closed');
  const [holding, setHolding] = useState(false);
  const [question, setQuestion] = useState<GateQuestion>(() => makeGateQuestion());
  const [name, setName] = useState(playerName);
  const [voice, setVoice] = useState(voiceOn);
  const [erased, setErased] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const startHold = () => {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      setQuestion(makeGateQuestion());
      setStep('gate');
    }, GEAR_HOLD_MS);
  };
  const endHold = () => {
    setHolding(false);
    window.clearTimeout(timer.current);
  };

  const answer = (n: number) => {
    if (n !== question.answer) return setStep('closed'); // wrong: close quietly, no hint
    setName(playerName);
    setVoice(voiceOn);
    setErased(false);
    setStep('open');
  };

  return (
    <>
      <button
        className={`gear ${holding ? 'holding' : ''}`}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Grown-up settings (press and hold)"
        title="Grown-ups: press and hold"
      >
        ⚙️
      </button>

      {step === 'gate' && (
        <div className="overlay">
          <div className="settings gate pop-in" role="dialog" aria-labelledby="gate-title">
            <h2 id="gate-title">Grown-ups only</h2>
            <p className="gate-q">
              What is {question.a} + {question.b}?
            </p>
            <div className="gate-choices">
              {question.choices.map((n) => (
                <button key={n} id={`gate-${n}`} onClick={() => answer(n)}>
                  {n}
                </button>
              ))}
            </div>
            <div className="settings-actions">
              <button onClick={() => setStep('closed')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {step === 'open' && (
        <div className="overlay">
          <div className="settings pop-in" role="dialog" aria-labelledby="settings-title">
            <h2 id="settings-title">Grown-up Settings</h2>
            <label htmlFor="settings-name">
              Explorer's name
              <input id="settings-name" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="row" htmlFor="settings-voice">
              <input id="settings-voice" type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
              Narration voice on
            </label>

            <div className="erase-box">
              <strong>Start over</strong>
              <span className="hint">
                Erases {playerName}'s stamps, badges and missions. The name and voice setting stay.
              </span>
              {erased ? (
                <p className="erased" role="status">
                  ✓ Progress erased
                </p>
              ) : (
                <HoldButton
                  ms={ERASE_HOLD_MS}
                  label={`Hold to erase ${playerName}'s progress`}
                  onDone={() => {
                    onReset();
                    setErased(true);
                  }}
                />
              )}
            </div>

            <p className="hint">
              Progress is saved on this device only. Tip: on iPad, tap Share → "Add to Home Screen" to play full-screen.
            </p>
            <div className="settings-actions">
              <button onClick={() => setStep('closed')}>{erased ? 'Close' : 'Cancel'}</button>
              <button
                className="primary"
                onClick={() => {
                  onSave(name.trim() || 'Explorer', voice);
                  setStep('closed');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A button that only fires after being held down for `ms`; letting go early cancels. */
function HoldButton({ ms, label, onDone }: { ms: number; label: string; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  const start = useRef(0);

  const stop = () => {
    cancelAnimationFrame(raf.current);
    start.current = 0;
    setProgress(0);
  };
  const begin = () => {
    if (start.current) return;
    start.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / ms);
      setProgress(p);
      if (p >= 1) {
        start.current = 0;
        onDone();
      } else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <button
      className={`hold-btn ${progress > 0 ? 'active' : ''}`}
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && begin()}
      onKeyUp={stop}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ['--p' as string]: progress }}
    >
      <span className="hold-fill" aria-hidden="true" />
      <span className="hold-label">{progress > 0 ? 'Keep holding…' : label}</span>
    </button>
  );
}
