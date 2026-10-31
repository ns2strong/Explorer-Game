import { REGIONS } from '../data/regions';
import { STATES } from '../data/states';
import { ACHIEVEMENTS } from '../data/achievements';
import { L } from '../data/lines';
import { personalize } from '../lib/progress';
import { Icon } from './Icon';

interface Props {
  playerName: string;
  visited: Set<string>;
  earned: Set<string>;
  /** A fact is playing: wait for it to finish. */
  busy: boolean;
  /** Speak a line; facts play to the end before anything else can. */
  speak: (text: string) => void;
  onClose: () => void;
}

export function Passport({ playerName, visited, earned, busy, speak, onClose }: Props) {
  return (
    <div className="overlay">
      <div className={`passport pop-in ${busy ? 'busy' : ''}`}>
        <header className="passport-head">
          <button
            className="passport-title"
            onClick={() => speak(personalize(L.passport(visited.size), playerName))}
          >
            📘 {playerName}'s Passport <span className="speaker">🔊</span>
          </button>
          <div className="stamp-count" aria-label={`${visited.size} of 50 stamps`}>
            {visited.size} / 50
          </div>
          <button className="round-btn" onClick={onClose} aria-label="Close passport">
            ✖️
          </button>
        </header>

        <section className="badges">
          {ACHIEVEMENTS.map((a) => {
            const got = earned.has(a.id);
            return (
              <button
                key={a.id}
                className={`badge ${got ? 'got' : 'locked'}`}
                onClick={() => speak(got ? a.title : L.badgeLocked)}
                aria-label={got ? a.title : 'Locked badge'}
              >
                <span className="badge-icon">{got ? a.icon : '🔒'}</span>
                <span className="badge-title">{got ? a.title : '???'}</span>
              </button>
            );
          })}
        </section>

        <section className="stamp-pages">
          {REGIONS.map((r) => (
            <div key={r.id} className="stamp-page" style={{ ['--region' as string]: r.color, ['--region-deep' as string]: r.deep }}>
              <button className="stamp-page-title" onClick={() => speak(r.name)}>
                {r.emoji} {r.name}
              </button>
              <div className="stamps">
                {STATES.filter((s) => s.region === r.id).map((s) => {
                  const got = visited.has(s.code);
                  return (
                    <button
                      key={s.code}
                      className={`stamp ${got ? 'got' : 'empty'}`}
                      onClick={() => speak(got ? L.stateFact(s) : L.stampEmpty)}
                      aria-label={got ? s.name : 'Empty stamp'}
                    >
                      {got ? <Icon icon={s.things[0].icon} size="1.9rem" /> : <span className="q">?</span>}
                      <span className="stamp-label">{got ? s.code : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
