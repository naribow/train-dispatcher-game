
// src/game/Station.ts

import { TrackSegment, StraightTrack, CurvedTrack, SwitchTrack } from './TrackSegment';

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
    const track1 = new StraightTrack(
      'track1',
      { x: 0, y: 360 }, // 画面中央付近
      { x: 1280, y: 360 }, // 画面の端まで
      []
    );

    this.trackSegments.set(track1.id, track1);
  }

  private createComplexLayout() {
    // 複雑なレイアウト: 2つのホーム、2本の通過線、いくつかの分岐
    // 座標はGAME_WIDTH = 1280, GAME_HEIGHT = 720 を基準に調整

    // ホーム1 (上)
    const platform1 = new StraightTrack(
      'platform1',
      { x: 100, y: 200 },
      { x: 1180, y: 200 },
      []
    );

    // ホーム2 (下)
    const platform2 = new StraightTrack(
      'platform2',
      { x: 100, y: 500 },
      { x: 1180, y: 500 },
      []
    );

    // 線路
    const trackA = new StraightTrack(
      'trackA',
      { x: 0, y: 250 },
      { x: 1280, y: 250 },
      ['switchA_P1', 'switchA_PT1', 'trackA_exit']
    );

    const trackA_exit = new StraightTrack(
      'trackA_exit',
      { x: 1280, y: 250 },
      { x: 1380, y: 250 }, // 画面外へ
      []
    );

    const trackB = new StraightTrack(
      'trackB',
      { x: 0, y: 450 },
      { x: 1280, y: 450 },
      ['switchB_P2', 'switchB_PT2', 'trackB_exit']
    );

    const trackB_exit = new StraightTrack(
      'trackB_exit',
      { x: 1280, y: 450 },
      { x: 1380, y: 450 }, // 画面外へ
      []
    );

    // 通過線
    const passingTrack1 = new StraightTrack(
      'passingTrack1',
      { x: 0, y: 100 },
      { x: 1280, y: 100 },
      []
    );

    const passingTrack2 = new StraightTrack(
      'passingTrack2',
      { x: 0, y: 600 },
      { x: 1280, y: 600 },
      []
    );

    // 分岐器
    const switchA_P1 = new SwitchTrack(
      'switchA_P1',
      { x: 250, y: 250 },
      { x: 200, y: 200 }, // platform1の開始点に接続
      { x: 250, y: 250 }, // 分岐器の描画用（実際には使われない）
      ['platform1']
    );

    const switchB_P2 = new SwitchTrack(
      'switchB_P2',
      { x: 250, y: 450 },
      { x: 200, y: 500 }, // platform2の開始点に接続
      { x: 250, y: 450 }, // 分岐器の描画用
      ['platform2']
    );

    const switchA_PT1 = new SwitchTrack(
      'switchA_PT1',
      { x: 300, y: 250 },
      { x: 350, y: 100 },
      { x: 300, y: 250 }, // 分岐器の描画用
      ['passingTrack1']
    );

    const switchB_PT2 = new SwitchTrack(
      'switchB_PT2',
      { x: 300, y: 450 },
      { x: 350, y: 600 },
      { x: 300, y: 450 }, // 分岐器の描画用
      ['passingTrack2']
    );

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
  }

  public getSegment(id: string): TrackSegment | undefined {
    return this.trackSegments.get(id);
  }
}
