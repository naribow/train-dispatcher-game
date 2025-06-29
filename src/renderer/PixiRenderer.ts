
import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station'; // 再追加
import { Train } from '../game/Train'; // 再追加

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private trainContainer: Container; // 初期化を元に戻す
  private stationLayoutContainer: Container; // 初期化を元に戻す

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.trainContainer = new Container(); // 初期化を元に戻す
    this.stationLayoutContainer = new Container(); // 初期化を元に戻す
    console.log("PixiRenderer: Constructor called.");
  }

  public async init(parentElement: HTMLElement) {
    console.log("PixiRenderer: init method called with parentElement:", parentElement);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      parentElement.appendChild(canvas);
      console.log("PixiRenderer: Canvas created and appended.", canvas);

      this.app = new Application();

      await this.app.init({
        canvas: canvas,
        backgroundColor: 0x1099bb,
        width: this.width,
        height: this.height,
      });
      console.log("PixiRenderer: PixiJS Application initialized.", this.app);

      this.app.start(); // Start the rendering loop
      console.log("PixiRenderer: PixiJS rendering loop started.");

      this.app.stage.addChild(this.stationLayoutContainer); // ステージに駅レイアウトコンテナを追加
      this.app.stage.addChild(this.trainContainer); // ステージに列車コンテナを追加 (駅レイアウトの上に描画されるように)

      this.resize();
      window.addEventListener('resize', this.resize.bind(this));
      console.log("PixiRenderer: Stage setup complete.");

    } catch (error) {
      console.error("PixiRenderer: Error during PixiJS Application initialization:", error);
    }
  }

  private resize() {
    console.log("PixiRenderer: resize method called.");
    if (this.app) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.app.renderer.resize(this.width, this.height);
      console.log(`PixiRenderer: Resized to ${this.width}x${this.height}`);
    }
  }

  // clearTrainsを有効にする
  public clearTrains() {
    this.trainContainer.removeChildren();
    console.log("PixiRenderer: trainContainer cleared.");
  }

  public drawStationLayout(station: Station) { // station: Station 引数を再追加
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren(); // 既存のレイアウトをクリア
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // 駅のホーム (例: 1つのホーム)
    const platform = new Graphics();
    platform.rect(50, 200, 500, 50); // x, y, width, height
    platform.fill(0xFFD700); // 金色
    this.stationLayoutContainer.addChild(platform); // stationLayoutContainerに追加

    // 線路 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.moveTo(segment.start.x, segment.start.y);
      track.lineTo(segment.end.x, segment.end.y);
      track.stroke({ width: 5, color: 0x8B4513 }); // 茶色
      this.stationLayoutContainer.addChild(track); // stationLayoutContainerに追加
    });

    console.log("PixiRenderer: Minimal station layout drawn from data.");

    // 明示的にレンダリングを呼び出す
    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
  }

  // drawTrainsを有効にする
  public drawTrains(trains: Train[], station: Station) {
    console.log("PixiRenderer: drawTrains method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw trains: PixiJS Application not initialized.");
      return;
    }
    this.trainContainer.removeChildren(); // Clear existing trains

    trains.forEach(train => {
      const segment = station.getSegment(train.currentSegmentId);
      if (segment) {
        const trainGraphic = new Graphics();
        trainGraphic.rect(-50, -25, 100, 50); // 列車のサイズを大きく変更 (100x50)
        trainGraphic.fill(0xFFFFFF); // 純粋な白に変更
        trainGraphic.stroke({ width: 5, color: 0x000000 }); // 黒い枠線を追加
        this.trainContainer.addChild(trainGraphic); // Add to trainContainer

        // Calculate train position
        const x = segment.start.x + (segment.end.x - segment.start.x) * train.positionOnSegment;
        const y = segment.start.y + (segment.end.y - segment.start.y) * train.positionOnSegment;

        trainGraphic.position.set(x, y);
        console.log(`PixiRenderer: Train ${train.id} drawn at x=${x}, y=${y}.`); // 列車の座標をログに出力
      }
    });
    console.log(`PixiRenderer: ${trains.length} trains drawn.`);
  }
}
