import { Station } from './Station.ts';
import { Train } from './Train.ts';
import type { StationLayoutData } from './data/StationLayoutData.ts';
import type { TrainData } from './data/TrainData.ts';

export class GameState {
  public station: Station;
  public trains: Map<string, Train> = new Map();
  private trainCounter = 0;

  constructor(layout: StationLayoutData) {
    this.station = new Station(layout);
  }

  update(deltaTime: number): void {
    // Update trains
    this.trains.forEach(train => {
      const oldSegmentId = train.currentSegmentId;
      train.update(deltaTime, this.station);
      const newSegmentId = train.currentSegmentId;

      // Update track occupancy
      if (oldSegmentId !== newSegmentId) {
        this.station.updateTrackOccupancy(oldSegmentId, null);
        this.station.updateTrackOccupancy(newSegmentId, train.id);
      }

      // Despawn logic
      const segment = this.station.getTrackSegmentById(newSegmentId);
      if (!segment || segment.nextSegmentIds.length === 0 && train.positionOnSegment >= 1.0) {
        this.station.updateTrackOccupancy(newSegmentId, null);
        this.trains.delete(train.id);
      }
    });
  }

  spawnTrain(): void {
    const spawnSegmentId = 'track_entry'; // Spawn point
    if (this.station.isTrackOccupied(spawnSegmentId)) {
      // Spawn segment is occupied, do not spawn a new train
      return;
    }

    const id = `train-${this.trainCounter++}`;
    const trainData: TrainData = {
      id,
      currentSegmentId: spawnSegmentId,
      positionOnSegment: 0,
      speed: 50, // pixels per second
      type: 'local',
      color: 0xff0000,
      carCount: 4,
      preferredPlatformIds: ['platform_1'],
      assignedPlatformId: null,
    };
    const train = new Train(trainData);
    this.trains.set(id, train);
    this.station.updateTrackOccupancy(train.currentSegmentId, train.id);
  }
}
