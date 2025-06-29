
export class Train {
  public id: string;
  public currentSegmentId: string;
  public positionOnSegment: number; // 0.0 (start) to 1.0 (end)
  public speed: number; // pixels per second

  constructor(id: string, startSegmentId: string, speed: number) {
    this.id = id;
    this.currentSegmentId = startSegmentId;
    this.positionOnSegment = 0;
    this.speed = speed;
  }

  public update(deltaTime: number, segmentLength: number): boolean {
    // deltaTimeは秒単位
    const distanceToTravel = this.speed * deltaTime;
    this.positionOnSegment += distanceToTravel / segmentLength;

    if (this.positionOnSegment >= 1.0) {
      this.positionOnSegment = 1.0; // セグメントの終端に到達
      return true; // 次のセグメントへ移動可能
    }
    return false; // まだセグメント内
  }
}
