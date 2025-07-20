import type { SwitchData } from './data/SwitchData.ts';
import type { Point } from '../types/geom.ts';

export class Switch {
  public readonly id: string;
  public readonly poiId: string;
  public readonly entrySegmentId: string;
  public readonly type: 'diverging' | 'converging';
  public readonly paths: { id: string; targetSegmentId: string; controlPoints: Point[] }[];
  public currentPathIndex: number;

  constructor(data: SwitchData) {
    this.id = data.id;
    this.poiId = data.poiId;
    this.entrySegmentId = data.entrySegmentId;
    this.type = data.type;
    this.paths = data.paths;
    this.currentPathIndex = 0; // Default to the first path
  }

  togglePath(): void {
    this.currentPathIndex = (this.currentPathIndex + 1) % this.paths.length;
  }

  getCurrentTargetPathId(): string {
    return this.paths[this.currentPathIndex].targetSegmentId;
  }

  getCurrentPathControlPoints(): Point[] {
    return this.paths[this.currentPathIndex].controlPoints;
  }
}
