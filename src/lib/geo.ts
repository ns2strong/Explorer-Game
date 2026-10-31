import { geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Topology, GeometryCollection } from 'topojson-specification';
import atlas from 'us-atlas/states-albers-10m.json';
import { STATES, STATE_BY_FIPS } from '../data/states';
import type { RegionId } from '../data/regions';

/** us-atlas "albers" files are pre-projected into a 975×610 canvas. */
export const MAP_W = 975;
export const MAP_H = 610;

export type Box = [number, number, number, number]; // x, y, w, h

export interface StateShape {
  fips: string;
  d: string;
  box: Box;
  centroid: [number, number];
}

const topo = atlas as unknown as Topology<{ states: GeometryCollection }>;
const fc = feature(topo, topo.objects.states) as FeatureCollection<Geometry>;
const path = geoPath(); // identity projection — the data is already projected

function toShape(f: Feature<Geometry>): StateShape {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  return {
    fips: String(f.id),
    d: path(f) ?? '',
    box: [x0, y0, x1 - x0, y1 - y0],
    centroid: path.centroid(f) as [number, number],
  };
}

export const SHAPES: StateShape[] = fc.features.map(toShape);

export const SHAPE_BY_FIPS: Record<string, StateShape> = Object.fromEntries(
  SHAPES.map((s) => [s.fips, s]),
);

/** Michigan, Hawaii etc. have a centroid that sits sensibly; a few need nudging for icon placement. */
const ICON_NUDGE: Record<string, [number, number]> = {
  '26': [12, 20], // Michigan: put the icon on the mitten, not the lake
  '12': [18, 10], // Florida: into the peninsula
  '22': [-8, -4], // Louisiana
  '24': [10, -4], // Maryland
  '51': [10, 0],  // Virginia
  '15': [8, 4],   // Hawaii: big island area
};

export const iconPoint = (fips: string): [number, number] => {
  const s = SHAPE_BY_FIPS[fips];
  const n = ICON_NUDGE[fips] ?? [0, 0];
  return [s.centroid[0] + n[0], s.centroid[1] + n[1]];
};

function unionBox(boxes: Box[]): Box {
  const x0 = Math.min(...boxes.map((b) => b[0]));
  const y0 = Math.min(...boxes.map((b) => b[1]));
  const x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
  const y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  return [x0, y0, x1 - x0, y1 - y0];
}

export function padBox([x, y, w, h]: Box, frac: number, minSize = 0): Box {
  const size = Math.max(w, h, minSize);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const pw = Math.max(w, size * 0.6) * (1 + frac * 2);
  const ph = Math.max(h, size * 0.5) * (1 + frac * 2);
  return [cx - pw / 2, cy - ph / 2, pw, ph];
}

export const COUNTRY_BOX: Box = [0, 0, MAP_W, MAP_H];

export const REGION_BOX = {} as Record<RegionId, Box>;
for (const regionId of new Set(STATES.map((s) => s.region))) {
  const boxes = STATES.filter((s) => s.region === regionId).map((s) => SHAPE_BY_FIPS[s.fips].box);
  REGION_BOX[regionId] = padBox(unionBox(boxes), 0.08);
}

export const regionOfFips = (fips: string): RegionId | undefined => STATE_BY_FIPS[fips]?.region;
