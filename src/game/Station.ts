export interface TrackSegment {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  length: number;
  nextSegments: string[]; // 次のセグメントのID
  occupiedBy: string | null; // 列車ID、またはnull
}

export class Station {
  public trackSegments: Map<string, TrackSegment> = new Map();

  constructor() {
    this.createInitialLayout();
  }

  private createInitialLayout() {
    // 仮のレイアウト: シンプルな直線線路
    // Canvasの幅が606pxなので、座標を調整
    const segment1: TrackSegment = {
      id: 'segment1',
      start: { x: 50, y: 225 },
      end: { x: 300, y: 225 },
      length: 250,
      nextSegments: ['segment2'],
      occupiedBy: null,
    };
    const segment2: TrackSegment = {
      id: 'segment2',
      start: { x: 300, y: 225 },
      end: { x: 550, y: 225 },
      length: 250,
      nextSegments: [], // 駅の出口
      occupiedBy: null,
    };

    this.trackSegments.set(segment1.id, segment1);
    this.trackSegments.set(segment2.id, segment2);
  }

  public getSegment(id: string): TrackSegment | undefined {
    return this.trackSegments.get(id);
  }
}