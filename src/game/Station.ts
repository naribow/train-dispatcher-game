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

  constructor(layoutType: 'simple' | 'complex' = 'simple') {
    if (layoutType === 'simple') {
      this.createSimpleLayout();
    } else {
      // this.createComplexLayout(); // 今回は使用しない
    }
  }

  private createSimpleLayout() {
    // シンプルなレイアウト: 1本の線路と1つのホーム
    const track1: TrackSegment = {
      id: 'track1',
      start: { x: 100, y: 360 }, // 画面中央付近に調整
      end: { x: 1180, y: 360 }, // 画面の端まで
      length: 1080,
      nextSegments: [],
      occupiedBy: null,
    };

    this.trackSegments.set(track1.id, track1);
  }

  public getSegment(id: string): TrackSegment | undefined {
    return this.trackSegments.get(id);
  }
}