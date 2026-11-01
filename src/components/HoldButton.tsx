import { useEffect, useRef, useState } from 'react';

/** A button that only fires after being held down for `ms`; letting go early cancels. */
export function HoldButton({ ms, label, onDone }: { ms: number; label: string; onDone: () => void }) {
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
