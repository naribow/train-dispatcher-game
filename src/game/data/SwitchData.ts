import type { Point } from '../../types/geom.ts';

export interface SwitchData {
  id: string;
  poiId: string;
  entrySegmentId: string;
  type: 'diverging' | 'converging';
  paths: { id: string; targetSegmentId: string; controlPoints: Point[] }[];
}
