import { useMemo } from 'react';

const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff8fab'];

/** A burst of falling confetti and stars. Remount (change `key`) to replay. */
export function Confetti({ extra = '⭐' }: { extra?: string }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.8 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 30,
        rot: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        emoji: i % 7 === 0 ? extra : null,
      })),
    [extra],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={p.emoji ? 'confetti-emoji' : 'confetti-bit'}
          style={{
            left: `${p.left}%`,
            background: p.emoji ? undefined : p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--drift' as string]: `${p.drift}vw`,
            ['--rot' as string]: `${p.rot}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
