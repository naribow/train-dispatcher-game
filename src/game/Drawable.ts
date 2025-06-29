// src/game/Drawable.ts

import { Graphics } from 'pixi.js';

export interface Drawable {
  draw(graphics: Graphics): void;
}