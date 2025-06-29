
// src/game/Rail.ts

import { Graphics } from 'pixi.js';
import { Drawable } from './Drawable';

export class Rail implements Drawable {
  public start: { x: number; y: number };
  public end: { x: number; y: number };
  public width: number;
  public color: number;

  constructor(start: { x: number; y: number }, end: { x: number; y: number }, width: number, color: number) {
    this.start = start;
    this.end = end;
    this.width = width;
    this.color = color;
  }

  draw(graphics: Graphics): void {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.end.x, this.end.y);
    graphics.stroke({ width: this.width, color: this.color });
  }
}
