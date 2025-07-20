import type { TrainData } from './data/TrainData.ts';
import type { Station } from './Station.ts';

export class Train {
  public readonly id: string;
  public currentSegmentId: string;
  public positionOnSegment: number;
  public speed: number;
  public readonly color: number;

  constructor(data: TrainData) {
    this.id = data.id;
    this.currentSegmentId = data.currentSegmentId;
    this.positionOnSegment = data.positionOnSegment;
    this.speed = data.speed;
    this.color = data.color;
  }

  update(deltaTime: number, station: Station): void {
    const segment = station.getTrackSegmentById(this.currentSegmentId);
    if (!segment) return;

    const distanceToMove = this.speed * (deltaTime / 1000);
    let newPositionOnSegment = this.positionOnSegment + distanceToMove / segment.length;

    // Debug log: Current train state before segment transition check
    console.log(`Train ${this.id}: Current segment: ${this.currentSegmentId}, Position: ${this.positionOnSegment.toFixed(4)}, Speed: ${this.speed.toFixed(2)}`);

    if (newPositionOnSegment >= 1.0) {
      console.log(`Train ${this.id}: Reached end of segment ${this.currentSegmentId}. Looking for next segment.`);
      const nextSegmentId = station.getNextSegmentId(this.currentSegmentId); // Use Station to get next segment
      
      if (nextSegmentId) {
        console.log(`Train ${this.id}: Next segment candidate: ${nextSegmentId}`);
        // Check if the next segment is occupied
        if (station.isTrackOccupied(nextSegmentId)) {
          // If occupied, stop at the end of the current segment
          this.positionOnSegment = 0.9999; // Stop just before the end
          this.speed = 0; // Stop the train
          console.log(`Train ${this.id}: Next segment ${nextSegmentId} is occupied. Stopping at ${this.currentSegmentId}.`);
          return; // Do not proceed to next segment
        } else {
          // If not occupied, move to the next segment
          const oldSegmentId = this.currentSegmentId; // Store old segment ID for logging

          // Calculate the distance that overshot the current segment
          const overshotDistanceInGameUnits = (newPositionOnSegment - 1.0) * segment.length;

          const nextSegment = station.getTrackSegmentById(nextSegmentId);
          if (!nextSegment) {
            console.error(`Train ${this.id}: Next segment ${nextSegmentId} not found.`);
            this.positionOnSegment = 1.0; // Stop at end of current segment
            this.speed = 0;
            return;
          }

          this.currentSegmentId = nextSegmentId;
          // The new position on the next segment is the overshot distance divided by the next segment's length
          this.positionOnSegment = overshotDistanceInGameUnits / nextSegment.length;

          // Ensure positionOnSegment is not negative due to floating point inaccuracies
          if (this.positionOnSegment < 0) {
              this.positionOnSegment = 0;
          }

          // Update occupancy immediately for the new segment
          station.updateTrackOccupancy(this.currentSegmentId, this.id);
          station.updateTrackOccupancy(oldSegmentId, null); // Clear old segment occupancy
          console.log(`Train ${this.id}: Moved from ${oldSegmentId} to ${this.currentSegmentId}.`);
        }
      } else {
        // No next segment, train should despawn (handled by GameState)
        this.positionOnSegment = 1.0; // Ensure it reaches the end for despawn logic
        this.speed = 0;
        console.log(`Train ${this.id}: No next segment found. Preparing for despawn.`);
      }
    } else {
      this.positionOnSegment = newPositionOnSegment;
    }
  }
}
