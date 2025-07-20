

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
      id: 'track_entry',
      points: [{ x: 50, y: 100 }, { x: 200, y: 100 }],
      length: 150,
      nextSegmentIds: ['track_diverge_left', 'track_diverge_right'], // Both paths from switch
      prevSegmentIds: [],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
    {
      id: 'track_diverge_left',
      points: [{ x: 200, y: 100 }, { x: 350, y: 50 }],
      length: 180.28, // Approx length
      nextSegmentIds: ['track_exit_left'], // End of line for now
      prevSegmentIds: ['track_entry'],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
    {
      id: 'track_diverge_right',
      points: [{ x: 200, y: 100 }, { x: 350, y: 150 }],
      length: 180.28, // Approx length
      nextSegmentIds: ['track_exit_right'], // Add next segment for consistency
      prevSegmentIds: ['track_entry'],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
    {
      id: 'track_exit_left',
      points: [{ x: 350, y: 50 }, { x: 500, y: 50 }],
      length: 150,
      nextSegmentIds: [], // End of line
      prevSegmentIds: ['track_diverge_left'],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
    {
      id: 'track_exit_right',
      points: [{ x: 350, y: 150 }, { x: 500, y: 150 }],
      length: 150,
      nextSegmentIds: [], // End of line
      prevSegmentIds: ['track_diverge_right'],
      isPlatformSegment: false,
      type: 'straight',
      occupiedBy: null,
    },
  ],
  pois: [
    {
      id: 'poi_spawn',
      segmentId: 'track_entry',
      positionOnSegment: 0,
      type: 'spawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_despawn_left',
      segmentId: 'track_diverge_left',
      positionOnSegment: 1,
      type: 'despawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_despawn_right',
      segmentId: 'track_diverge_right',
      positionOnSegment: 1,
      type: 'despawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_despawn_exit_left',
      segmentId: 'track_exit_left',
      positionOnSegment: 1,
      type: 'despawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_despawn_exit_right',
      segmentId: 'track_exit_right',
      positionOnSegment: 1,
      type: 'despawn',
      relatedEntityId: null,
    },
    {
      id: 'poi_signal_entry',
      segmentId: 'track_entry',
      positionOnSegment: 0.1,
      type: 'signal',
      relatedEntityId: 'signal_entry',
    },
    {
      id: 'poi_switch_main',
      segmentId: 'track_entry',
      positionOnSegment: 0.9,
      type: 'switch',
      relatedEntityId: 'switch_diverging_main',
    },
  ],
  platforms: [],
  signals: [
    {
      id: 'signal_entry',
      poiId: 'poi_signal_entry',
      controlledSegmentId: 'track_entry',
      initialState: 'red',
    },
  ],
  switches: [
    {
      id: 'switch_diverging_main',
      poiId: 'poi_switch_main',
      entrySegmentId: 'track_entry',
      type: 'diverging',
      paths: [
        { id: 'path_left', targetSegmentId: 'track_diverge_left', controlPoints: [{ x: 200, y: 100 }, { x: 350, y: 50 }] },
        { id: 'path_right', targetSegmentId: 'track_diverge_right', controlPoints: [{ x: 200, y: 100 }, { x: 350, y: 150 }] },
      ],
    },
  ],
};