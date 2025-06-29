
import { Application, Graphics, Container } from 'pixi.js';

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

  public drawStationLayout() { // station: Station 引数を削除
    console.log("PixiRenderer: drawStationLayout method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    this.stationLayoutContainer.removeChildren(); // 既存のレイアウトをクリア
    console.log("PixiRenderer: stationLayoutContainer cleared.");

    // 画面全体を覆う大きなマゼンタ色の四角形を描画
    const fullScreenRect = new Graphics();
    fullScreenRect.rect(0, 0, this.width, this.height); // 画面全体 (rectを先に呼び出す)
    fullScreenRect.fill(0xFF00FF); // マゼンタ色
    this.stationLayoutContainer.addChild(fullScreenRect);
    console.log("PixiRenderer: Full screen magenta rectangle drawn.");

    // 明示的にレンダリングを呼び出す
    if (this.app) {
      this.app.render();
      console.log("PixiRenderer: Explicit render called after drawing station layout.");
    }
  }
}
