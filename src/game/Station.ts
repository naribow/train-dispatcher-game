import type { StationLayoutData } from './data/StationLayoutData.ts';
import type { TrackSegmentData } from './data/TrackSegmentData.ts';
import type { PointOfInterestData } from './data/PointOfInterestData.ts';
import type { SignalData } from './data/SignalData.ts';
import type { SwitchData } from './data/SwitchData.ts';
import { Signal } from './Signal.ts';
import { Switch } from './Switch.ts';

export class Station {
  private tracks: Map<string, TrackSegmentData> = new Map();
  private signals: Map<string, Signal> = new Map();
  private switches: Map<string, Switch> = new Map();
  private pois: Map<string, PointOfInterestData> = new Map();

  constructor(layout: StationLayoutData) {
    layout.tracks.forEach((track: TrackSegmentData) => {
      this.tracks.set(track.id, { ...track });
    });
    layout.signals.forEach((signalData: SignalData) => {
      const signal = new Signal(signalData.id, signalData.poiId, signalData.controlledSegmentId, signalData.initialState);
      this.signals.set(signal.id, signal);
    });
    layout.switches.forEach((switchData: SwitchData) => {
      const sw = new Switch(switchData);
      this.switches.set(sw.id, sw);
    });
    layout.pois.forEach((poi: PointOfInterestData) => {
      this.pois.set(poi.id, { ...poi });
    });
  }

  getTrackSegmentById(id: string): TrackSegmentData | undefined {
    return this.tracks.get(id);
  }

  getSignalById(id: string): Signal | undefined {
    return this.signals.get(id);
  }

  getSwitchById(id: string): Switch | undefined {
    return this.switches.get(id);
  }

  getPOIById(id: string): PointOfInterestData | undefined {
    return this.pois.get(id);
  }

  updateTrackOccupancy(trackId: string, trainId: string | null): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.occupiedBy = trainId;
    }
  }

  isTrackOccupied(trackId: string): boolean {
    const track = this.tracks.get(trackId);
    return !!track && !!track.occupiedBy;
  }

  getNextSegmentId(currentSegmentId: string): string | undefined {
    const currentSegment = this.getTrackSegmentById(currentSegmentId);
    if (!currentSegment) return undefined;

    if (currentSegment.nextSegmentIds.length === 1) {
      console.log(`Station: Segment ${currentSegmentId} has single next segment: ${currentSegment.nextSegmentIds[0]}`);
      return currentSegment.nextSegmentIds[0];
    } else if (currentSegment.nextSegmentIds.length > 1) {
      // This is a diverging switch entry segment
      // Find the switch POI associated with this segment
      const switchPoi = Array.from(this.pois.values()).find(poi => 
          poi.segmentId === currentSegmentId && poi.type === 'switch'
      );
      if (switchPoi) {
          const sw = this.getSwitchById(switchPoi.relatedEntityId!); // Assuming relatedEntityId is always set for switches
          if (sw) {
              const targetSegmentId = sw.getCurrentTargetPathId();
              console.log(`Station: Segment ${currentSegmentId} is switch entry. Switch ${sw.id} selected path: ${targetSegmentId}. Is target occupied? ${this.isTrackOccupied(targetSegmentId)}`);
              return targetSegmentId;
          }
      } else {
          console.warn(`Station: Segment ${currentSegmentId} has multiple next segments but no associated switch POI found.`);
      }
    }
    console.log(`Station: No next segment found for ${currentSegmentId}.`);
    return undefined;
  }

  getLayoutData(): StationLayoutData {
    return {
        tracks: Array.from(this.tracks.values()),
        pois: Array.from(this.pois.values()), // Return actual POIs
        platforms: [], // Not managed by Station yet
        signals: Array.from(this.signals.values()).map(s => ({
            id: s.id,
            poiId: s.poiId,
            controlledSegmentId: s.controlledSegmentId,
            initialState: s.currentState,
        })),
        switches: Array.from(this.switches.values()).map(sw => ({
            id: sw.id,
            poiId: sw.poiId,
            entrySegmentId: sw.entrySegmentId,
            type: sw.type,
            paths: sw.paths,
        })),
    };
  }
}
