// src/game/TrackSegment.ts

import { Graphics } from 'pixi.js';

export interface TrackSegment {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  length: number;
  nextSegments: string[]; // 次のセグメントのID
  occupiedBy: string | null; // 列車ID、またはnull
  draw: (graphics: Graphics) => void; // 描画メソッドをアロー関数として定義
}

export class StraightTrack implements TrackSegment {
  public id: string;
  public start: { x: number; y: number };
  public end: { x: number; y: number };
  public length: number;
  public nextSegments: string[];
  public occupiedBy: string | null = null;

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, nextSegments: string[] = []) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    this.nextSegments = nextSegments;
  }

  draw = (graphics: Graphics): void => {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.end.x, this.end.y);
  };
}

export class CurvedTrack implements TrackSegment {
  public id: string;
  public start: { x: number; y: number };
  public end: { x: number; y: number };
  public length: number;
  public nextSegments: string[];
  public occupiedBy: string | null = null;

  private controlPoint: { x: number; y: number };

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, controlPoint: { x: number; y: number }, nextSegments: string[] = []) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.controlPoint = controlPoint;
    this.length = 100; // 仮の長さ
    this.nextSegments = nextSegments;
  }

  draw = (graphics: Graphics): void => {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, this.end.x, this.end.y);
  };
}

export class SwitchTrack implements TrackSegment {
  public id: string;
  public start: { x: number; y: number };
  public end: { x: number; y: number }; // メインの進路の終点
  public length: number;
  public nextSegments: string[];
  public occupiedBy: string | null = null;

  private divergentEnd: { x: number; y: number }; // 分岐側の進路の終点

  constructor(id: string, start: { x: number; y: number }, end: { x: number; y: number }, divergentEnd: { x: number; y: number }, nextSegments: string[] = []) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.divergentEnd = divergentEnd;
    this.length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)); // 仮の長さ
    this.nextSegments = nextSegments;
  }

  draw = (graphics: Graphics): void => {
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.end.x, this.end.y);

    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.divergentEnd.x, this.divergentEnd.y);
  };
}