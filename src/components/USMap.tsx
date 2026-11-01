import { useEffect, useRef, useState } from 'react';
import { SHAPES, COUNTRY_BOX, REGION_BOX, iconPoint, type Box } from '../lib/geo';
import { STATE_BY_FIPS } from '../data/states';
import { REGION_BY_ID, type RegionId } from '../data/regions';

interface Props {
  /** null = whole country, otherwise zoomed into a region. */
  region: RegionId | null;
  visited: Set<string>;
  /** FIPS codes to pulse as a hint. */
  glow: Set<string>;
  /** FIPS codes ruled out during a mission: greyed and not tappable. */
  ruledOut: Set<string>;
  /** A state that should do a happy bounce; `n` changes on every tap to replay it. */
  bounce: { fips: string; n: number } | null;
  onTap: (fips: string) => void;
}

/** Rhode Island, Delaware, Hawaii — hard to tap without help. */
const TINY = ['44', '10', '15'];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Smoothly animate the SVG viewBox when zooming between country and region. */
function useAnimatedBox(target: Box, ms = 700): Box {
  const [box, setBox] = useState<Box>(target);
  const from = useRef<Box>(target);
  const current = useRef<Box>(target);

  useEffect(() => {
    from.current = current.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = easeInOut(t);
      const next = from.current.map((v, i) => v + (target[i] - v) * e) as Box;
      current.current = next;
      setBox(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.join(',')]);

  return box;
}

export function USMap({ region, visited, glow, ruledOut, bounce, onTap }: Props) {
  const target = region ? REGION_BOX[region] : COUNTRY_BOX;
  const box = useAnimatedBox(target);
  // Icons should look about the same size on screen at any zoom level.
  const scale = box[2] / COUNTRY_BOX[2];

  return (
    <svg
      className="usmap"
      viewBox={box.join(' ')}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={region ? REGION_BY_ID[region].name : 'Map of the United States'}
    >
      <defs>
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy={3 * scale} stdDeviation={2 * scale} floodColor="#1d3557" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#soft-shadow)">
        {SHAPES.map((shape) => {
          const st = STATE_BY_FIPS[shape.fips];
          if (!st) {
            // District of Columbia: draw it so the map has no hole, but it isn't tappable.
            return <path key={shape.fips} d={shape.d} fill="#ffb4a2" stroke="#fff" strokeWidth={0.6 * scale} pointerEvents="none" />;
          }
          const r = REGION_BY_ID[st.region];
          const dimmed = region !== null && st.region !== region;
          const classes = ['state'];
          // Alaska & Hawaii are drawn as insets; hide them when zoomed elsewhere so they don't look like neighbors.
          if (dimmed) classes.push(st.region === 'faraway' ? 'inset-hidden' : 'dimmed');
          const out = ruledOut.has(shape.fips);
          if (out) classes.push('ruled-out');
          else if (glow.has(shape.fips)) classes.push('glow');
          const bouncing = bounce?.fips === shape.fips;
          if (bouncing) classes.push('bounce');
          return (
            <path
              key={bouncing ? `${shape.fips}-${bounce!.n}` : shape.fips}
              d={shape.d}
              className={classes.join(' ')}
              fill={out ? '#c9ced6' : visited.has(st.code) ? r.deep : r.color}
              stroke="#fff"
              strokeWidth={1.2 * scale}
              strokeLinejoin="round"
              onClick={() => onTap(shape.fips)}
              style={{ ['--glow' as string]: r.deep }}
            >
              <title>{st.name}</title>
            </path>
          );
        })}
      </g>

      {/* Tiny states get a bigger invisible tap target so little fingers can hit them. */}
      <g>
        {TINY.map((fips) => {
          const st = STATE_BY_FIPS[fips];
          if (ruledOut.has(fips) || (region !== null && st.region !== region)) return null;
          const [x, y] = iconPoint(fips);
          return (
            <circle key={fips} cx={x} cy={y} r={20 * scale} fill="transparent" onClick={() => onTap(fips)}>
              <title>{st.name}</title>
            </circle>
          );
        })}
      </g>

      {/* Visited states show their picture, so the map fills up as Ava explores. */}
      <g pointerEvents="none">
        {SHAPES.map((shape) => {
          const st = STATE_BY_FIPS[shape.fips];
          if (!st || !visited.has(st.code) || ruledOut.has(shape.fips)) return null;
          if (region !== null && st.region !== region) return null;
          const [x, y] = iconPoint(shape.fips);
          const fit = Math.min(shape.box[2], shape.box[3]) * 0.7;
          const size = Math.max(Math.min(fit, 34 * scale), 11 * scale);
          const icon = st.things[0].icon === 'ARCH' ? st.things[1].icon : st.things[0].icon;
          return (
            <text key={shape.fips} x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="central" className="map-icon">
              {icon}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
