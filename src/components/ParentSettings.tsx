import { useRef, useState } from 'react';

interface Props {
  playerName: string;
  voiceOn: boolean;
  onSave: (name: string, voiceOn: boolean) => void;
  onReset: () => void;
}

/**
 * A small gear in the corner. It must be held for 2 seconds to open,
 * so a 4-year-old won't wander into the settings by accident.
 */
export function ParentSettings({ playerName, voiceOn, onSave, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const [holding, setHolding] = useState(false);
  const [name, setName] = useState(playerName);
  const [voice, setVoice] = useState(voiceOn);
  const timer = useRef<number | undefined>(undefined);

  const startHold = () => {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      setName(playerName);
      setVoice(voiceOn);
      setOpen(true);
    }, 2000);
  };
  const endHold = () => {
    setHolding(false);
    window.clearTimeout(timer.current);
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

      {open && (
        <div className="overlay">
          <div className="settings pop-in">
            <h2>Grown-up Settings</h2>
            <label>
              Explorer's name
              <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="row">
              <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
              Narration voice on
            </label>
            <p className="hint">
              Progress is saved on this device only. Tip: on iPad, tap Share → "Add to Home Screen" to play full-screen.
            </p>
            <div className="settings-actions">
              <button
                className="danger"
                onClick={() => {
                  if (window.confirm(`Erase all of ${playerName}'s stamps and badges?`)) {
                    onReset();
                    setOpen(false);
                  }
                }}
              >
                Reset progress
              </button>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                className="primary"
                onClick={() => {
                  onSave(name.trim() || 'Explorer', voice);
                  setOpen(false);
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
