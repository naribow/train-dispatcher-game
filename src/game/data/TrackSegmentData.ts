import type { Point } from '../../types/geom.ts';

export interface TrackSegmentData {
  id: string;
  points: Point[];
  length: number;
  nextSegmentIds: string[];
  prevSegmentIds: string[];
  isPlatformSegment: boolean;
  type: 'straight' | 'curve';
  occupiedBy: string | null;
}
