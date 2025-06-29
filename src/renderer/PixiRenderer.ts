
import { Application, Graphics } from 'pixi.js';

export class PixiRenderer {
  private app: Application | null = null;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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

  public drawRedSquare() {
    console.log("PixiRenderer: drawRedSquare method called.");
    if (!this.app) {
      console.error("PixiRenderer: Cannot draw red square: PixiJS Application not initialized.");
      return;
    }

    const square = new Graphics();
    const squareSize = 100;
    const squareX = this.app.screen.width / 2 - squareSize / 2;
    const squareY = this.app.screen.height / 2 - squareSize / 2;

    console.log(`PixiRenderer: Red square position: x=${squareX}, y=${squareY}, size=${squareSize}`);

    square.rect(squareX, squareY, squareSize, squareSize);
    square.fill(0xFF0000); // Red
    this.app.stage.addChild(square);
    console.log("PixiRenderer: Red square added to stage.");
  }
}
