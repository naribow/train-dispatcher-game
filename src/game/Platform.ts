// src/game/Platform.ts

import { Graphics } from 'pixi.js';
import { Drawable } from './Drawable';

export class Platform implements Drawable {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(graphics: Graphics): void {
    graphics.rect(this.x, this.y, this.width, this.height);
    graphics.fill(this.color);
  }
}
