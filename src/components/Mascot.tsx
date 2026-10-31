interface Props {
  /** What Finn last said (shown for grown-ups; tap to hear again). */
  line: string;
  talking: boolean;
  onReplay: () => void;
}

/** Finn the fox: Ava's guide. Tap Finn to hear the last thing again. */
export function Mascot({ line, talking, onReplay }: Props) {
  return (
    <button className={`mascot ${talking ? 'talking' : ''}`} onClick={onReplay} aria-label="Finn the fox. Tap to hear again.">
      <span className="mascot-fox" aria-hidden="true">
        🦊
      </span>
      {line && (
        <span className="bubble">
          {line} <span className="speaker">🔊</span>
        </span>
      )}
    </button>
  );
}
