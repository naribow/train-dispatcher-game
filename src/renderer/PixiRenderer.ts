
import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station';
import { Train } from '../game/Train';
import { StraightTrack, CurvedTrack, SwitchTrack, TrackSegment } from '../game/TrackSegment';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private trainContainer: Container;
  private stationLayoutContainer: Container;

  private readonly GAME_WIDTH = 1280;
  private readonly GAME_HEIGHT = 720;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.trainContainer = new Container();
    this.stationLayoutContainer = new Container();
    console.log("PixiRenderer: Constructor called.");
  }

  public async init(parentElement: HTMLElement) {
    console.log("PixiRenderer: init method called with parentElement:", parentElement);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = this.GAME_WIDTH;
      canvas.height = this.GAME_HEIGHT;
      parentElement.appendChild(canvas);
      console.log("PixiRenderer: Canvas created and appended.", canvas);

      this.app = new Application();

      await this.app.init({
        canvas: canvas,
        backgroundColor: 0x1099bb,
        width: this.GAME_WIDTH,
        height: this.GAME_HEIGHT,
      });
      console.log("PixiRenderer: PixiJS Application initialized.", this.app);

      this.app.start();
      console.log("PixiRenderer: PixiJS rendering loop started.");

      this.app.stage.addChild(this.stationLayoutContainer);
      this.app.stage.addChild(this.trainContainer);

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
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const scale = Math.min(currentWidth / this.GAME_WIDTH, currentHeight / this.GAME_HEIGHT);

      const newWidth = this.GAME_WIDTH * scale;
      const newHeight = this.GAME_HEIGHT * scale;

      this.app.canvas.style.width = `${newWidth}px`;
      this.app.canvas.style.height = `${newHeight}px`;
      this.app.canvas.style.position = 'absolute';
      this.app.canvas.style.left = `${(currentWidth - newWidth) / 2}px`;
      this.app.canvas.style.top = `${(currentHeight - newHeight) / 2}px`;

      this.app.renderer.resize(this.GAME_WIDTH, this.GAME_HEIGHT);

      console.log(`PixiRenderer: Resized to ${newWidth}x${newHeight} (scaled from ${this.GAME_WIDTH}x${this.GAME_HEIGHT})`);
    }
  }

  public clearTrains() {
    this.trainContainer.removeChildren();
    console.log("PixiRenderer: trainContainer cleared.");
  }

  public drawStationLayout(station: Station) {
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren();
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // ホームの描画
    const platform1Graphic = new Graphics();
    platform1Graphic.rect(100, 200, 1080, 50);
    platform1Graphic.fill(0xFFD700);
    this.stationLayoutContainer.addChild(platform1Graphic);

    const platform2Graphic = new Graphics();
    platform2Graphic.rect(100, 500, 1080, 50);
    platform2Graphic.fill(0xFFD700);
    this.stationLayoutContainer.addChild(platform2Graphic);

    // 線路の描画 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      console.log('Debugging segment:', segment, 'typeof segment:', typeof segment, 'segment.draw:', segment.draw);
      segment.draw(track); // TrackSegmentのdrawメソッドを呼び出す
      track.stroke({ width: 5, color: 0x000000 }); // 線路の色を純粋な黒に変更
      this.stationLayoutContainer.addChild(track);
    });

    // 信号機 (プレースホルダー)
    const signal1 = new Graphics();
    signal1.rect(80, 225, 10, 30);
    signal1.fill(0xFF0000);
    this.stationLayoutContainer.addChild(signal1);

    const signal2 = new Graphics();
    signal2.rect(80, 525, 10, 30);
    signal2.fill(0xFF0000);
    this.stationLayoutContainer.addChild(signal2);

    // 分岐器 (プレースホルダー)
    const switch1 = new Graphics();
    switch1.moveTo(250, 250);
    switch1.lineTo(200, 200);
    switch1.stroke({ width: 5, color: 0x000000 }); // 黒
    this.stationLayoutContainer.addChild(switch1);

    const switch2 = new Graphics();
    switch2.moveTo(250, 450);
    switch2.lineTo(200, 500);
    switch2.stroke({ width: 5, color: 0x000000 }); // 黒
    this.stationLayoutContainer.addChild(switch2);

    const switch3 = new Graphics();
    switch3.moveTo(300, 250);
    switch3.lineTo(350, 100);
    switch3.stroke({ width: 5, color: 0x000000 }); // 黒
    this.stationLayoutContainer.addChild(switch3);

    const switch4 = new Graphics();
    switch4.moveTo(300, 450);
    switch4.lineTo(350, 600);
    switch4.stroke({ width: 5, color: 0x000000 }); // 黒
    this.stationLayoutContainer.addChild(switch4);

    console.log("PixiRenderer: Complex station layout drawn from data.");

    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
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
