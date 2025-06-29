
import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station';
import { Train } from '../game/Train';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private trainContainer: Container;
  private stationLayoutContainer: Container; // 新しいコンテナ

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.trainContainer = new Container();
    this.stationLayoutContainer = new Container(); // 初期化
    console.log("PixiRenderer: Constructor called.");
  }

  public async init(parentElement: HTMLElement) {
    console.log("PixiRenderer: init method called with parentElement:", parentElement);
    try {
      // Explicitly create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      parentElement.appendChild(canvas);
      console.log("PixiRenderer: Canvas created and appended.", canvas);

      // Pass the canvas to the Application constructor
      this.app = new Application({
        view: canvas, // Use 'view' for the canvas element in v8
        backgroundColor: 0x1099bb, // Blue background
      });

      // Await the init method for the application
      await this.app.init(); // This is important for v8
      console.log("PixiRenderer: PixiJS Application initialized.", this.app);

      if (this.app && this.app.canvas) { // Check this.app.canvas after init()
        this.app.stage.addChild(this.stationLayoutContainer); // ステージに駅レイアウトコンテナを追加
        this.app.stage.addChild(this.trainContainer); // ステージに列車コンテナを追加
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        console.log("PixiRenderer: Stage setup complete.");
      } else {
        console.error("PixiRenderer: Failed to initialize PixiJS Application or its canvas property is missing after init().");
        if (this.app) {
          console.error("PixiRenderer: this.app exists, but this.app.canvas is:", this.app.canvas);
        }
      }
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

  public clearStage() {
    // ステージ全体をクリアするのではなく、列車コンテナのみをクリア
    this.trainContainer.removeChildren();
    console.log("PixiRenderer: trainContainer cleared.");
  }

  public drawStationLayout(station: Station) {
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren(); // 既存のレイアウトをクリア（初回描画時のみ）
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // 駅のホーム (例: 2つのホーム)
    const platform1 = new Graphics();
    platform1.fill(0xAAAAAA); // Use fill instead of beginFill/endFill
    platform1.rect(50, 200, 700, 50); // Use rect instead of drawRect
    this.stationLayoutContainer.addChild(platform1); // stationLayoutContainerに追加

    const platform2 = new Graphics();
    platform2.fill(0xAAAAAA);
    platform2.rect(50, 350, 700, 50);
    this.stationLayoutContainer.addChild(platform2); // stationLayoutContainerに追加

    // 線路 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.stroke({ width: 5, color: 0x333333 }); // Use stroke instead of lineStyle
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
    switch1.stroke({ width: 5, color: 0x333333 });
    switch1.moveTo(400, 225);
    switch1.lineTo(450, 200); // Temporary switch
    this.stationLayoutContainer.addChild(switch1); // stationLayoutContainerに追加
    console.log("PixiRenderer: Station layout drawn.");
  }

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
        trainGraphic.fill(0x00FF00); // Green train
        trainGraphic.rect(-10, -5, 20, 10); // Train size
        this.trainContainer.addChild(trainGraphic); // Add to trainContainer

        // Calculate train position
        const x = segment.start.x + (segment.end.x - segment.start.x) * train.positionOnSegment;
        const y = segment.start.y + (segment.end.y - segment.start.y) * train.positionOnSegment;

        trainGraphic.position.set(x, y);
      }
    });
    console.log(`PixiRenderer: ${trains.length} trains drawn.`);
  }
}
