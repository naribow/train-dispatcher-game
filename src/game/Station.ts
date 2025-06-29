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
      this.createComplexLayout();
    }
  }

  private createSimpleLayout() {
    // シンプルなレイアウト: 1本の線路と1つのホーム
    const segment1: TrackSegment = {
      id: 'track1',
      start: { x: 0, y: 360 }, // 画面中央付近
      end: { x: 1280, y: 360 }, // 画面の端まで
      length: 1280,
      nextSegments: [],
      occupiedBy: null,
    };

    this.trackSegments.set(segment1.id, segment1);
  }

  private createComplexLayout() {
    // 複雑なレイアウト: 2つのホーム、2本の通過線、いくつかの分岐
    // 座標はGAME_WIDTH = 1280, GAME_HEIGHT = 720 を基準に調整

    // ホーム1 (上)
    const platform1: TrackSegment = {
      id: 'platform1',
      start: { x: 100, y: 200 },
      end: { x: 1180, y: 200 },
      length: 1080,
      nextSegments: [],
      occupiedBy: null,
    };

    // ホーム2 (下)
    const platform2: TrackSegment = {
      id: 'platform2',
      start: { x: 100, y: 500 },
      end: { x: 1180, y: 500 },
      length: 1080,
      nextSegments: [],
      occupiedBy: null,
    };

    // 線路
    const trackA: TrackSegment = { // 上の線路
      id: 'trackA',
      start: { x: 0, y: 250 },
      end: { x: 1280, y: 250 },
      length: 1280,
      nextSegments: ['switchA_P1', 'switchA_PT1', 'trackA_exit'], // trackA_exitはtrackAの続き
      occupiedBy: null,
    };

    const trackA_exit: TrackSegment = { // trackAの続き（出口）
      id: 'trackA_exit',
      start: { x: 1280, y: 250 },
      end: { x: 1380, y: 250 }, // 画面外へ
      length: 100,
      nextSegments: [],
      occupiedBy: null,
    };

    const trackB: TrackSegment = { // 下の線路
      id: 'trackB',
      start: { x: 0, y: 450 },
      end: { x: 1280, y: 450 },
      length: 1280,
      nextSegments: ['switchB_P2', 'switchB_PT2', 'trackB_exit'], // trackB_exitはtrackBの続き
      occupiedBy: null,
    };

    const trackB_exit: TrackSegment = { // trackBの続き（出口）
      id: 'trackB_exit',
      start: { x: 1280, y: 450 },
      end: { x: 1380, y: 450 }, // 画面外へ
      length: 100,
      nextSegments: [],
      occupiedBy: null,
    };

    // 通過線
    const passingTrack1: TrackSegment = { // 上の通過線
      id: 'passingTrack1',
      start: { x: 0, y: 100 },
      end: { x: 1280, y: 100 },
      length: 1280,
      nextSegments: [],
      occupiedBy: null,
    };

    const passingTrack2: TrackSegment = { // 下の通過線
      id: 'passingTrack2',
      start: { x: 0, y: 600 },
      end: { x: 1280, y: 600 },
      length: 1280,
      nextSegments: [],
      occupiedBy: null,
    };

    // 分岐器
    const switchA_P1: TrackSegment = { // trackAからplatform1への分岐
      id: 'switchA_P1',
      start: { x: 250, y: 250 },
      end: { x: 200, y: 200 }, // platform1の開始点に接続
      length: 50,
      nextSegments: ['platform1'],
      occupiedBy: null,
    };

    const switchB_P2: TrackSegment = { // trackBからplatform2への分岐
      id: 'switchB_P2',
      start: { x: 250, y: 450 },
      end: { x: 200, y: 500 }, // platform2の開始点に接続
      length: 50,
      nextSegments: ['platform2'],
      occupiedBy: null,
    };

    const switchA_PT1: TrackSegment = { // trackAからpassingTrack1への分岐 (仮)
      id: 'switchA_PT1',
      start: { x: 300, y: 250 },
      end: { x: 350, y: 100 },
      length: 50,
      nextSegments: ['passingTrack1'],
      occupiedBy: null,
    };

    const switchB_PT2: TrackSegment = { // trackBからpassingTrack2への分岐 (仮)
      id: 'switchB_PT2',
      start: { x: 300, y: 450 },
      end: { x: 350, y: 600 },
      length: 50,
      nextSegments: ['passingTrack2'],
      occupiedBy: null,
    };

    this.trackSegments.set(platform1.id, platform1);
    this.trackSegments.set(platform2.id, platform2);
    this.trackSegments.set(trackA.id, trackA);
    this.trackSegments.set(trackA_exit.id, trackA_exit);
    this.trackSegments.set(trackB.id, trackB);
    this.trackSegments.set(trackB_exit.id, trackB_exit);
    this.trackSegments.set(passingTrack1.id, passingTrack1);
    this.trackSegments.set(passingTrack2.id, passingTrack2);
    this.trackSegments.set(switchA_P1.id, switchA_P1);
    this.trackSegments.set(switchB_P2.id, switchB_P2);
    this.trackSegments.set(switchA_PT1.id, switchA_PT1);
    this.trackSegments.set(switchB_PT2.id, switchB_PT2);

    // 線路の接続を更新
    // trackAのnextSegmentsを更新
    this.trackSegments.get('trackA')!.nextSegments = ['switchA_P1', 'switchA_PT1', 'trackA_exit'];
    // trackBのnextSegmentsを更新
    this.trackSegments.get('trackB')!.nextSegments = ['switchB_P2', 'switchB_PT2', 'trackB_exit'];

    // 分岐器の接続
    this.trackSegments.get('switchA_P1')!.nextSegments = ['platform1'];
    this.trackSegments.get('switchB_P2')!.nextSegments = ['platform2'];
    this.trackSegments.get('switchA_PT1')!.nextSegments = ['passingTrack1'];
    this.trackSegments.get('switchB_PT2')!.nextSegments = ['passingTrack2'];
  }

  public getSegment(id: string): TrackSegment | undefined {
    return this.trackSegments.get(id);
  }
}