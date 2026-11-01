import { useState } from 'react';
import { STATES, STATE_BY_CODE } from '../data/states';
import { NOTE_MAX, SPECIAL_ICONS, type SpecialPlaces } from '../lib/special';
import { clearVoices, deleteVoice, loadVoice, saveVoice } from '../lib/specialVoice';
import { HoldButton } from './HoldButton';
import { VoiceRecorder } from './VoiceRecorder';

interface Props {
  playerName: string;
  places: SpecialPlaces;
  /** Called with the full new set; the app saves it right away. */
  onChange: (places: SpecialPlaces) => void;
}

const blankForm = { code: '', icon: '❤️', note: '', voice: null as Blob | null };

/** Grown-up editor for states with a personal meaning. Changes save immediately. */
export function SpecialPlacesEditor({ playerName, places, onChange }: Props) {
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);

  const entries = Object.entries(places).sort(([a], [b]) => STATE_BY_CODE[a].name.localeCompare(STATE_BY_CODE[b].name));
  const canSave = form.code !== '' && form.note.trim() !== '';

  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    const next = { ...places };
    if (editing && editing !== form.code) {
      delete next[editing];
      await deleteVoice(editing);
    }
    // Keep the recording on this device; if it can't be stored, fall back to the built-in voice.
    const stored = form.voice ? await saveVoice(form.code, form.voice) : (await deleteVoice(form.code), false);
    next[form.code] = {
      icon: form.icon,
      note: form.note.trim().slice(0, NOTE_MAX),
      ...(stored ? { voice: Date.now() } : {}),
    };
    onChange(next);
    setForm(blankForm);
    setEditing(null);
    setCleared(false);
    setSaving(false);
  };

  const edit = async (code: string) => {
    setEditing(code);
    setForm({ code, icon: places[code].icon, note: places[code].note, voice: null });
    const voice = places[code].voice ? await loadVoice(code) : null;
    if (voice) setForm((f) => (f.code === code ? { ...f, voice } : f));
  };

  const remove = (code: string) => {
    const next = { ...places };
    delete next[code];
    void deleteVoice(code);
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
                {p.voice ? <span className="voice-tag"> 🎙️ your voice</span> : null}
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

        <VoiceRecorder playerName={playerName} value={form.voice} onChange={(voice) => setForm((f) => ({ ...f, voice }))} />

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
          <button className="primary" disabled={!canSave || saving} onClick={() => void save()}>
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
              void clearVoices();
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
