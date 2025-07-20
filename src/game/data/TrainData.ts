export interface TrainData {
  id: string;
  currentSegmentId: string;
  positionOnSegment: number; // 0.0 to 1.0
  speed: number; // pixels per second
  type: 'local' | 'express';
  color: number;
  carCount: number;
  preferredPlatformIds: string[];
  assignedPlatformId: string | null;
}
