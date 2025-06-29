
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
      // Explicitly create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      parentElement.appendChild(canvas);

      // Pass the canvas to the Application constructor
      this.app = new Application({
        view: canvas, // Use 'view' for the canvas element in v8
        backgroundColor: 0x1099bb, // Blue background
      });

      // Await the init method for the application
      await this.app.init(); // This is important for v8

      if (this.app && this.app.canvas) { // Check this.app.canvas after init()
        this.app.stage.addChild(this.trainContainer);
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
      } else {
        console.error("Failed to initialize PixiJS Application or its canvas property is missing after init().");
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
      this.app.stage.addChild(this.trainContainer); // Keep train container
    }
  }

  public drawStationLayout(station: Station) {
    if (!this.app) {
      console.error("Cannot draw layout: PixiJS Application not initialized.");
      return;
    }

    // Station platforms
    const platform1 = new Graphics();
    platform1.fill(0xAAAAAA); // Use fill instead of beginFill/endFill
    platform1.rect(50, 200, 700, 50); // Use rect instead of drawRect
    this.app!.stage.addChild(platform1);

    const platform2 = new Graphics();
    platform2.fill(0xAAAAAA);
    platform2.rect(50, 350, 700, 50);
    this.app!.stage.addChild(platform2);

    // Tracks
    station.trackSegments.forEach(segment => {
      const track = new Graphics();
      track.stroke({ width: 5, color: 0x333333 }); // Use stroke instead of lineStyle
      track.moveTo(segment.start.x, segment.start.y);
      track.lineTo(segment.end.x, segment.end.y);
      this.app!.stage.addChild(track);
    });

    // Signals (placeholders)
    const signal1 = new Graphics();
    signal1.fill(0xFF0000);
    signal1.rect(20, 210, 10, 30);
    this.app!.stage.addChild(signal1);

    const signal2 = new Graphics();
    signal2.fill(0xFF0000);
    signal2.rect(20, 360, 10, 30);
    this.app!.stage.addChild(signal2);

    // Switches (placeholders)
    const switch1 = new Graphics();
    switch1.stroke({ width: 5, color: 0x333333 });
    switch1.moveTo(400, 225);
    switch1.lineTo(450, 200); // Temporary switch
    this.app!.stage.addChild(switch1);
  }

  public drawTrains(trains: Train[], station: Station) {
    if (!this.app) {
      console.error("Cannot draw trains: PixiJS Application not initialized.");
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
  }
}
