
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
    // シンプルなレイアウト: 1本の線路と1つのホーム
    const segment1: TrackSegment = {
      id: 'track1',
      start: { x: 0, y: 225 },
      end: { x: 600, y: 225 },
      length: 600,
      nextSegments: [],
      occupiedBy: null,
    };

    this.trackSegments.set(segment1.id, segment1);
  }

  public getSegment(id: string): TrackSegment | undefined {
    return this.trackSegments.get(id);
  }
}
