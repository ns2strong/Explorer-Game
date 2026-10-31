import { useState } from 'react';
import type { Thing, UsState } from '../data/states';
import { REGION_BY_ID } from '../data/regions';
import { L } from '../data/lines';
import { SHAPE_BY_FIPS, padBox } from '../lib/geo';
import { say } from '../lib/speech';
import { sfx } from '../lib/sound';
import { Icon } from './Icon';

interface Props {
  state: UsState;
  /** Picture facts (tile words) Ava has already heard for this state. */
  heard: Set<string>;
  /** The state's passport stamp is earned. */
  stamped: boolean;
  /** The stamp was earned just now: play the stamp animation. */
  justStamped: boolean;
  /** A fact is playing: other taps wait until it finishes. */
  busy: boolean;
  /** Increments when Ava taps while a fact is playing (wiggles the fact being read). */
  nudge: number;
  /** Ava tapped a picture. Returns false if a fact is still playing. */
  onPick: (t: Thing) => boolean;
  /** Replay the state's fact / say the capital. Return false if a fact is still playing. */
  onFact: () => boolean;
  onCapital: () => boolean;
  onClose: () => void;
}

export function StateCard({ state, heard, stamped, justStamped, busy, nudge, onPick, onFact, onCapital, onClose }: Props) {
  const region = REGION_BY_ID[state.region];
  const shape = SHAPE_BY_FIPS[state.fips];
  const vb = padBox(shape.box, 0.08);
  const [picked, setPicked] = useState<Thing | null>(null);

  const pick = (t: Thing) => {
    if (onPick(t)) setPicked(t);
  };
  // Alternate between two identical animations so every nudge restarts the wiggle.
  const nudgeClass = nudge > 0 ? `nudge-${nudge % 2}` : '';
  const stampIcon = state.things[0].icon === 'ARCH' ? '⭐' : state.things[0].icon;
  const heardCount = state.things.filter((t) => heard.has(t.word)).length;

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={`card pop-in ${busy ? 'busy' : ''}`}
        style={{ ['--region' as string]: region.color, ['--region-deep' as string]: region.deep }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="round-btn close-btn" onClick={onClose} aria-label="Close">
          ✖️
        </button>

        <button
          className={`card-hero ${busy && !picked ? nudgeClass : ''}`}
          onClick={() => {
            if (onFact()) setPicked(null);
          }}
          aria-label={`Hear about ${state.name}`}
        >
          <svg viewBox={vb.join(' ')} className="card-shape" aria-hidden="true">
            <path d={shape.d} fill={region.color} stroke={region.deep} strokeWidth={vb[2] / 80} strokeLinejoin="round" />
          </svg>
        </button>

        {stamped ? (
          <div className={`stamp-slot got ${justStamped ? 'slam' : ''}`} aria-label="Stamp earned">
            <Icon icon={stampIcon} size="2.2rem" />
          </div>
        ) : (
          <button
            className="stamp-slot"
            onClick={() => {
              if (busy) return;
              sfx.pop();
              void say(L.stampHint);
            }}
            aria-label={`${heardCount} of 3 pictures heard. Tap all three to earn the stamp.`}
          >
            <span className="stamp-dots" aria-hidden="true">
              {state.things.map((t) => (
                <span key={t.word} className={`dot ${heard.has(t.word) ? 'on' : ''}`} />
              ))}
            </span>
          </button>
        )}

        <h2 className="card-title">
          {state.name} <span className="speaker">🔊</span>
        </h2>

        <div className="tiles">
          {state.things.map((t) => (
            <button
              key={t.word}
              className={`tile ${picked === t ? 'picked' : ''} ${!stamped && !heard.has(t.word) ? 'invite' : ''}`}
              onClick={() => pick(t)}
              aria-label={t.word}
              aria-pressed={picked === t}
            >
              <Icon icon={t.icon} size="3.4rem" />
              <span className="tile-word">{t.word}</span>
              {heard.has(t.word) && (
                <span className="tile-check" aria-label="heard">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {picked && (
          <button className={`detail pop-in ${busy ? nudgeClass : ''}`} key={picked.word} onClick={() => pick(picked)} aria-label={`Hear about ${picked.word} again`}>
            <span className="detail-icon">
              <Icon icon={picked.icon} size="4.2rem" />
            </span>
            <span className="detail-text">
              <strong>{picked.word.charAt(0).toUpperCase() + picked.word.slice(1)}</strong>
              {picked.detail} <span className="speaker">🔊</span>
            </span>
          </button>
        )}

        <button
          className="capital-btn"
          onClick={() => {
            if (onCapital()) setPicked(null);
          }}
        >
          ⭐ Capital: {state.capital}
        </button>
      </div>
    </div>
  );
}
