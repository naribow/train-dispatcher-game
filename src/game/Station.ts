
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
    const segment1: TrackSegment = {
      id: 'segment1',
      start: { x: 0, y: 225 },
      end: { x: 400, y: 225 },
      length: 400,
      nextSegments: ['segment2'],
      occupiedBy: null,
    };
    const segment2: TrackSegment = {
      id: 'segment2',
      start: { x: 400, y: 225 },
      end: { x: 800, y: 225 },
      length: 400,
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
