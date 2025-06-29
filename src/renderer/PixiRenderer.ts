
import { Application, Graphics, Container } from 'pixi.js';
import { Station, TrackSegment } from '../game/Station'; // StationとTrackSegmentを再追加

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  private stationLayoutContainer: Container; // 再追加

  private readonly GAME_WIDTH = 1280;
  private readonly GAME_HEIGHT = 720;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.stationLayoutContainer = new Container(); // 再追加
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

      this.app.stage.addChild(this.stationLayoutContainer); // 再追加

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

  public drawStationLayout(station: Station) {
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren();
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // ホームの描画
    const platformGraphic = new Graphics();
    platformGraphic.rect(50, 335, 1180, 50); // x, y, width, height
    platformGraphic.fill(0xFFD700); // 金色
    this.stationLayoutContainer.addChild(platformGraphic);

    // 線路の描画 (Stationクラスから取得)
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.moveTo(segment.start.x, segment.start.y);
      track.lineTo(segment.end.x, segment.end.y);
      track.stroke({ width: 5, color: 0xFF00FF }); // 線路の色をマゼンタに変更 (strokeをlineToの後に移動)
      this.stationLayoutContainer.addChild(track);
    });

    console.log("PixiRenderer: Simple station layout drawn from data.");

    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
  }
}
