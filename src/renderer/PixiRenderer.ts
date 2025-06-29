
import { Application, Graphics } from 'pixi.js';

export class PixiRenderer {
  private app: Application;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.app = new Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0x1099bb, // 青色の背景
    });
  }

  public init(parentElement: HTMLElement) {
    parentElement.appendChild(this.app.canvas);
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.renderer.resize(this.width, this.height);
  }

  public drawStationLayout() {
    // 駅のホーム (例: 2つのホーム)
    const platform1 = new Graphics();
    platform1.beginFill(0xAAAAAA); // 灰色
    platform1.drawRect(50, 200, 700, 50); // x, y, width, height
    platform1.endFill();
    this.app.stage.addChild(platform1);

    const platform2 = new Graphics();
    platform2.beginFill(0xAAAAAA);
    platform2.drawRect(50, 350, 700, 50);
    platform2.endFill();
    this.app.stage.addChild(platform2);

    // 線路 (例: 2つのホームに繋がる直線)
    const track1 = new Graphics();
    track1.lineStyle(5, 0x333333); // 濃い灰色
    track1.moveTo(0, 225);
    track1.lineTo(800, 225);
    this.app.stage.addChild(track1);

    const track2 = new Graphics();
    track2.lineStyle(5, 0x333333);
    track2.moveTo(0, 375);
    track2.lineTo(800, 375);
    this.app.stage.addChild(track2);

    // 信号機 (プレースホルダー)
    const signal1 = new Graphics();
    signal1.beginFill(0xFF0000); // 赤色
    signal1.drawRect(20, 210, 10, 30);
    signal1.endFill();
    this.app.stage.addChild(signal1);

    const signal2 = new Graphics();
    signal2.beginFill(0xFF0000);
    signal2.drawRect(20, 360, 10, 30);
    signal2.endFill();
    this.app.stage.addChild(signal2);

    // 分岐器 (プレースホルダー)
    const switch1 = new Graphics();
    switch1.lineStyle(5, 0x333333);
    switch1.moveTo(400, 225);
    switch1.lineTo(450, 200); // 仮の分岐
    this.app.stage.addChild(switch1);
  }
}
