import type { UsState } from '../data/states';
import { REGION_BY_ID } from '../data/regions';
import { SHAPE_BY_FIPS, padBox } from '../lib/geo';
import { say } from '../lib/speech';
import { sfx } from '../lib/sound';
import { Icon } from './Icon';

interface Props {
  state: UsState;
  /** True the first time Ava visits — shows the stamp animation. */
  newStamp: boolean;
  onClose: () => void;
}

export function StateCard({ state, newStamp, onClose }: Props) {
  const region = REGION_BY_ID[state.region];
  const shape = SHAPE_BY_FIPS[state.fips];
  const vb = padBox(shape.box, 0.08);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="card pop-in"
        style={{ ['--region' as string]: region.color, ['--region-deep' as string]: region.deep }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="round-btn close-btn" onClick={onClose} aria-label="Close">
          ✖️
        </button>

        <button className="card-hero" onClick={() => say(`${state.name}! ${state.fact}`)} aria-label={`Hear about ${state.name}`}>
          <svg viewBox={vb.join(' ')} className="card-shape" aria-hidden="true">
            <path d={shape.d} fill={region.color} stroke={region.deep} strokeWidth={vb[2] / 80} strokeLinejoin="round" />
          </svg>
          {newStamp && (
            <div className="stamp-slam" aria-hidden="true">
              <Icon icon={state.things[0].icon === 'ARCH' ? '⭐' : state.things[0].icon} size="2.2rem" />
            </div>
          )}
        </button>

        <h2 className="card-title">
          {state.name} <span className="speaker">🔊</span>
        </h2>

        <div className="tiles">
          {state.things.map((t) => (
            <button
              key={t.word}
              className="tile wiggle-on-tap"
              onClick={() => {
                sfx.pop();
                void say(t.word);
              }}
              aria-label={t.word}
            >
              <Icon icon={t.icon} size="3.4rem" />
              <span className="tile-word">{t.word}</span>
            </button>
          ))}
        </div>

        <button
          className="capital-btn"
          onClick={() => {
            sfx.pop();
            void say(`The capital city of ${state.name} is ${state.capital}.`);
          }}
        >
          ⭐ Capital: {state.capital}
        </button>
      </div>
    </div>
  );
}
