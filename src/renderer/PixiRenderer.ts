import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private stationLayoutContainer: Container; // 新しいコンテナ

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.stationLayoutContainer = new Container(); // 初期化
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

  public drawStationLayout(station: Station) {
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren(); // 既存のレイアウトをクリア
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // 駅のホーム (例: 2つのホーム)
    const platform1 = new Graphics();
    platform1.fill(0xFFFF00); // 明るい黄色
    platform1.rect(50, 200, 500, 50); // x, y, width, height
    this.stationLayoutContainer.addChild(platform1); // stationLayoutContainerに追加

    const platform2 = new Graphics();
    platform2.fill(0xFFFF00);
    platform2.rect(50, 350, 500, 50);
    this.stationLayoutContainer.addChild(platform2); // stationLayoutContainerに追加

    // 線路 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.stroke({ width: 5, color: 0x00FF00 }); // 明るい緑色
      track.moveTo(segment.start.x, segment.start.y);
      track.lineTo(segment.end.x, segment.end.y);
      this.stationLayoutContainer.addChild(track); // stationLayoutContainerに追加
    });

    // 信号機 (プレースホルダー)
    const signal1 = new Graphics();
    signal1.fill(0xFF0000);
    signal1.rect(20, 210, 10, 30);
    this.stationLayoutContainer.addChild(signal1); // stationLayoutContainerに追加

    const signal2 = new Graphics();
    signal2.fill(0xFF0000);
    signal2.rect(20, 360, 10, 30);
    this.stationLayoutContainer.addChild(signal2); // stationLayoutContainerに追加

    // 分岐器 (プレースホルダー)
    const switch1 = new Graphics();
    switch1.stroke({ width: 5, color: 0x00FF00 });
    switch1.moveTo(300, 225);
    switch1.lineTo(350, 200); // 仮の分岐
    this.stationLayoutContainer.addChild(switch1); // stationLayoutContainerに追加
    console.log("PixiRenderer: Station layout drawn.");

    // 明示的にレンダリングを呼び出す
    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
  }
}