import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station';
import { Train } from '../game/Train';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private trainContainer: Container;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.trainContainer = new Container();
  }

  public async init(parentElement: HTMLElement) {
    try {
      this.app = new Application({
        width: this.width,
        height: this.height,
        backgroundColor: 0x1099bb, // 青色の背景
        forceCanvas: true, // Canvasレンダリングを強制
      });

      if (this.app && this.app.canvas) {
        parentElement.appendChild(this.app.canvas);
        this.app.stage.addChild(this.trainContainer);
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
      } else {
        console.error("Failed to initialize PixiJS Application or its canvas property is missing.");
        if (this.app) {
          console.error("this.app exists, but this.app.canvas is:", this.app.canvas);
        }
      }
    } catch (error) {
      console.error("Error during PixiJS Application initialization:", error);
    }
  }

  private resize() {
    if (this.app) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.app.renderer.resize(this.width, this.height);
    }
  }

  public clearStage() {
    if (this.app) {
      this.app.stage.removeChildren();
      this.app.stage.addChild(this.trainContainer); // 列車コンテナは残す
    }
  }

  public drawStationLayout(station: Station) {
    if (!this.app) {
      console.error("Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    // 駅のホーム (例: 2つのホーム)
    const platform1 = new Graphics();
    platform1.beginFill(0xAAAAAA); // 灰色
    platform1.drawRect(50, 200, 700, 50); // x, y, width, height
    platform1.endFill();
    this.app!.stage.addChild(platform1);

    const platform2 = new Graphics();
    platform2.beginFill(0xAAAAAA);
    platform2.drawRect(50, 350, 700, 50);
    platform2.endFill();
    this.app!.stage.addChild(platform2);

    // 線路 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.lineStyle(5, 0x333333); // 濃い灰色
      track.moveTo(segment.start.x, segment.start.y);
      track.lineTo(segment.end.x, segment.end.y);
      this.app!.stage.addChild(track);
    });

    // 信号機 (プレースホルダー)
    const signal1 = new Graphics();
    signal1.beginFill(0xFF0000); // 赤色
    signal1.drawRect(20, 210, 10, 30);
    signal1.endFill();
    this.app!.stage.addChild(signal1);

    const signal2 = new Graphics();
    signal2.beginFill(0xFF0000);
    signal2.drawRect(20, 360, 10, 30);
    signal2.endFill();
    this.app!.stage.addChild(signal2);

    // 分岐器 (プレースホルダー)
    const switch1 = new Graphics();
    switch1.lineStyle(5, 0x333333);
    switch1.moveTo(400, 225);
    switch1.lineTo(450, 200); // 仮の分岐
    this.app!.stage.addChild(switch1);
  }

  public drawTrains(trains: Train[], station: Station) {
    if (!this.app) {
      console.error("Cannot draw trains: PixiJS Application not initialized.");
      return;
    }
    this.trainContainer.removeChildren(); // 既存の列車をクリア

    trains.forEach(train => {
      const segment = station.getSegment(train.currentSegmentId);
      if (segment) {
        const trainGraphic = new Graphics();
        trainGraphic.beginFill(0x00FF00); // 緑色の列車
        trainGraphic.drawRect(-10, -5, 20, 10); // 列車のサイズ
        trainGraphic.endFill();

        // 列車の位置を計算
        const x = segment.start.x + (segment.end.x - segment.start.x) * train.positionOnSegment;
        const y = segment.start.y + (segment.end.y - segment.start.y) * train.positionOnSegment;

        trainGraphic.position.set(x, y);
        this.trainContainer.addChild(trainGraphic);
      }
    });
  }
}