export interface PointOfInterestData {
  id: string;
  segmentId: string;
  positionOnSegment: number;
  type: 'spawn' | 'despawn' | 'signal' | 'switch' | 'platform_entry' | 'platform_exit' | 'incident_zone';
  relatedEntityId: string | null;
}
