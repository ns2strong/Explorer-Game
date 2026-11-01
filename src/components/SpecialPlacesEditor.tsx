import { useState } from 'react';
import { STATES, STATE_BY_CODE } from '../data/states';
import { NOTE_MAX, SPECIAL_ICONS, type SpecialPlaces } from '../lib/special';
import { HoldButton } from './HoldButton';

interface Props {
  playerName: string;
  places: SpecialPlaces;
  /** Called with the full new set; the app saves it right away. */
  onChange: (places: SpecialPlaces) => void;
}

const blankForm = { code: '', icon: '❤️', note: '' };

/** Grown-up editor for states with a personal meaning. Changes save immediately. */
export function SpecialPlacesEditor({ playerName, places, onChange }: Props) {
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);

  const entries = Object.entries(places).sort(([a], [b]) => STATE_BY_CODE[a].name.localeCompare(STATE_BY_CODE[b].name));
  const canSave = form.code !== '' && form.note.trim() !== '';

  const save = () => {
    if (!canSave) return;
    const next = { ...places };
    if (editing && editing !== form.code) delete next[editing];
    next[form.code] = { icon: form.icon, note: form.note.trim().slice(0, NOTE_MAX) };
    onChange(next);
    setForm(blankForm);
    setEditing(null);
    setCleared(false);
  };

  const edit = (code: string) => {
    setEditing(code);
    setForm({ code, icon: places[code].icon, note: places[code].note });
  };

  const remove = (code: string) => {
    const next = { ...places };
    delete next[code];
    onChange(next);
    if (editing === code) {
      setEditing(null);
      setForm(blankForm);
    }
  };

  return (
    <div className="special-box">
      <strong>❤️ Special places</strong>
      <span className="hint">
        States that mean something to {playerName}. They get a heart on the map and a heart tile that reads your
        message. Saved on this device only, and kept when you start over.
      </span>

      {entries.length > 0 && (
        <ul className="special-list">
          {entries.map(([code, p]) => (
            <li key={code}>
              <span className="special-icon" aria-hidden="true">
                {p.icon}
              </span>
              <span className="special-text">
                <b>{STATE_BY_CODE[code].name}</b> {p.note}
              </span>
              <button onClick={() => edit(code)}>Edit</button>
              <button onClick={() => remove(code)} aria-label={`Remove ${STATE_BY_CODE[code].name}`}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="special-form">
        <label htmlFor="special-state">
          {editing ? `Edit ${STATE_BY_CODE[editing].name}` : 'Add a special place'}
          <select id="special-state" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}>
            <option value="">Choose a state…</option>
            {STATES.slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((s) => !places[s.code] || s.code === editing)
              .map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
          </select>
        </label>

        <div className="icon-picker" role="radiogroup" aria-label="Picture">
          {SPECIAL_ICONS.map((icon) => (
            <button
              key={icon}
              role="radio"
              aria-checked={form.icon === icon}
              className={form.icon === icon ? 'on' : ''}
              onClick={() => setForm({ ...form, icon })}
            >
              {icon}
            </button>
          ))}
        </div>

        <label htmlFor="special-note">
          Why it's special (read aloud to {playerName})
          <textarea
            id="special-note"
            rows={2}
            maxLength={NOTE_MAX}
            placeholder="This is the place you were born!"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </label>

        <div className="settings-actions">
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm(blankForm);
              }}
            >
              Cancel edit
            </button>
          )}
          <button className="primary" disabled={!canSave} onClick={save}>
            {editing ? 'Update place' : 'Add place'}
          </button>
        </div>
      </div>

      {entries.length > 0 &&
        (cleared ? null : (
          <HoldButton
            ms={3000}
            label="Hold to clear all special places"
            onDone={() => {
              onChange({});
              setCleared(true);
              setEditing(null);
              setForm(blankForm);
            }}
          />
        ))}
      {cleared && entries.length === 0 && (
        <p className="erased" role="status">
          ✓ Special places cleared
        </p>
      )}
    </div>
  );
}
