import type { TrackSegmentData } from './TrackSegmentData.ts';
import type { PointOfInterestData } from './PointOfInterestData.ts';
import type { PlatformData } from './PlatformData.ts';
import type { SignalData } from './SignalData.ts';
import type { SwitchData } from './SwitchData.ts';

export interface StationLayoutData {
  tracks: TrackSegmentData[];
  pois: PointOfInterestData[];
  platforms: PlatformData[];
  signals: SignalData[];
  switches: SwitchData[];
}

export const stationLayoutTestData: StationLayoutData = {
  tracks: [
    {
      id: 'track_straight_A',
      points: [{ x: 50, y: 100 }, { x: 250, y: 100 }],
      length: 200,
      nextSegmentIds: ['track_curve_B'],
      prevSegmentIds: [],
      isPlatformSegment: true,
      type: 'straight',
      occupiedBy: null,
    },
    {
      id: 'track_curve_B',
      points: [{ x: 250, y: 100 }, { x: 300, y: 150 }, { x: 250, y: 200 }],
      length: 141.4,
      nextSegmentIds: ['track_straight_C'],
      prevSegmentIds: ['track_straight_A'],
      isPlatformSegment: false,
      type: 'curve',
      occupiedBy: null,
    },
    {
      id: 'track_straight_C',
      points: [{ x: 250, y: 200 }, { x: 50, y: 200 }],
      length: 200,
      nextSegmentIds: [],
      prevSegmentIds: ['track_curve_B'],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
  ],
  pois: [
    {
      id: 'poi_spawn_A',
      segmentId: 'track_straight_A',
      positionOnSegment: 0,
      type: 'spawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_despawn_C',
      segmentId: 'track_straight_C',
      positionOnSegment: 1,
      type: 'despawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_signal_A',
      segmentId: 'track_straight_A',
      positionOnSegment: 0.1,
      type: 'signal',
      relatedEntityId: 'signal_entry_A',
    },
  ],
  platforms: [
    {
      id: 'platform_1',
      trackSegmentIds: ['track_straight_A'],
      drawingRect: { x: 50, y: 80, width: 200, height: 20 },
      length: 200,
    },
  ],
  signals: [
    {
      id: 'signal_entry_A',
      poiId: 'poi_signal_A',
      controlledSegmentId: 'track_straight_A',
      initialState: 'red',
    },
  ],
  switches: [],
};
