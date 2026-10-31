/** Renders an emoji, or a small hand-drawn SVG for things emoji can't show. */
export function Icon({ icon, size = '1em' }: { icon: string; size?: string }) {
  if (icon === 'ARCH') {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <path
          d="M14 92 C 18 30, 35 8, 50 8 C 65 8, 82 30, 86 92 L 76 92 C 73 40, 62 20, 50 20 C 38 20, 27 40, 24 92 Z"
          fill="#b8c4cc"
          stroke="#6c7a83"
          strokeWidth="3"
        />
        <rect x="4" y="90" width="92" height="6" rx="3" fill="#7bc96f" />
      </svg>
    );
  }
  return (
    <span className="emoji" style={{ fontSize: size }} aria-hidden="true">
      {icon}
    </span>
  );
}
