// src/game/TrackSegment.ts

import { Graphics } from 'pixi.js';

export abstract class TrackSegment {
  public id: string;
  public start: { x: number; y: number };
  public end: { x: number; y: number };
  public length: number;
  public nextSegments: string[]; // 次のセグメントのID
  public occupiedBy: string | null = null; // 列車ID、またはnull

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, nextSegments: string[] = []) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    this.nextSegments = nextSegments;
  }

  abstract draw(graphics: Graphics): void; // 抽象メソッドとして宣言
}

export class StraightTrack extends TrackSegment {
  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, nextSegments: string[] = []) {
    super(id, start, end, nextSegments);
  }

  draw(graphics: Graphics): void {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.end.x, this.end.y);
  }
}

export class CurvedTrack extends TrackSegment {
  private controlPoint: { x: number; y: number };

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, controlPoint: { x: number; y: number }, nextSegments: string[] = []) {
    super(id, start, end, nextSegments);
    this.controlPoint = controlPoint;
    this.length = 100; // 仮の長さ
  }

  draw(graphics: Graphics): void {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, this.end.x, this.end.y);
  }
}

export class SwitchTrack extends TrackSegment {
  private divergentEnd: { x: number; y: number };

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, divergentEnd: { x: number; y: number }, nextSegments: string[] = []) {
    super(id, start, end, nextSegments);
    this.divergentEnd = divergentEnd;
    this.length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)); // 仮の長さ
  }

  draw(graphics: Graphics): void {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.end.x, this.end.y);

    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.divergentEnd.x, this.divergentEnd.y);
  }
}