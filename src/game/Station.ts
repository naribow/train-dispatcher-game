
import { Platform } from './Platform';
import { Rail } from './Rail';

export class Station {
  public platforms: Platform[] = [];
  public rails: Rail[] = [];

  constructor(layoutType: 'simple' | 'complex' = 'simple', platformX: number = 50, platformY: number = 335, platformWidth: number = 1180, platformHeight: number = 50) {
    if (layoutType === 'simple') {
      this.createSimpleLayout(platformX, platformY, platformWidth, platformHeight);
    } else {
      // this.createComplexLayout(); // 今回は使用しない
    }
  }

  private createSimpleLayout(platformX: number, platformY: number, platformWidth: number, platformHeight: number) {
    // シンプルなレイアウト: 1つのホームと1本の線路

    // ホーム
    const platform = new Platform(platformX, platformY, platformWidth, platformHeight, 0xFFD700); // 金色
    this.platforms.push(platform);

    // 線路 (ホームの周りに来るように調整)
    // ホームの上側に線路を配置
    const railYTop = platformY - 20; // ホームの上から20px離す
    const railTop = new Rail({ x: 0, y: railYTop }, { x: 1280, y: railYTop }, 5, 0xFF00FF); // 画面の端から端まで、マゼンタ色
    this.rails.push(railTop);

    // ホームの下側に線路を配置
    const railYBottom = platformY + platformHeight + 20; // ホームの下から20px離す
    const railBottom = new Rail({ x: 0, y: railYBottom }, { x: 1280, y: railYBottom }, 5, 0xFF00FF); // 画面の端から端まで、マゼンタ色
    this.rails.push(railBottom);
  }
}
