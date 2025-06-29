import { Application, Graphics, Container } from 'pixi.js';
import { Station } from '../game/Station';
import { Platform } from '../game/Platform';
import { Rail } from '../game/Rail';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;
  public stationLayoutContainer: Container; // publicに変更

  private readonly GAME_WIDTH = 1280;
  private readonly GAME_HEIGHT = 720;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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

  public drawPlatform(x: number, y: number, width: number, height: number, color: number) {
    console.log("PixiRenderer: drawPlatform method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw platform: PixiJS Application not initialized.");
      return;
    }
    const platformGraphic = new Graphics();
    platformGraphic.rect(x, y, width, height);
    platformGraphic.fill(color);
    this.stationLayoutContainer.addChild(platformGraphic);
  }

  public drawLine(startX: number, startY: number, endX: number, endY: number, width: number, color: number) {
    console.log("PixiRenderer: drawLine method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw line: PixiJS Application not initialized.");
      return;
    }
    const lineGraphic = new Graphics();
    lineGraphic.moveTo(startX, startY);
    lineGraphic.lineTo(endX, endY);
    lineGraphic.stroke({ width: width, color: color });
    this.stationLayoutContainer.addChild(lineGraphic);
  }

  public drawStationLayout(station: Station) {
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    // this.stationLayoutContainer.removeChildren(); // 削除
    // console.log("PixiRenderer: stationLayoutContainer cleared."); // 削除

    // ホームの描画
    station.platforms.forEach(platform => {
      const platformGraphic = new Graphics();
      platform.draw(platformGraphic);
      this.stationLayoutContainer.addChild(platformGraphic);
    });

    // 線路の描画
    station.rails.forEach(rail => {
      const railGraphic = new Graphics();
      rail.draw(railGraphic);
      this.stationLayoutContainer.addChild(railGraphic);
    });

    console.log("PixiRenderer: Simple station layout drawn from data.");

    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
  }
}