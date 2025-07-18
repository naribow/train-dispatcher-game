import * as PIXI from 'pixi.js';
import type { StationLayoutData } from '../game/data/StationLayoutData.ts';
import { theme } from './ThemeManager.ts';

export class PixiRenderer {
  private app: PIXI.Application;

  constructor() {
    this.app = new PIXI.Application();
  }

  async init(container: HTMLElement) {
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: theme.backgroundColor,
      resizeTo: window,
    });
    container.appendChild(this.app.canvas);
  }

  public drawStaticLayout(layoutData: StationLayoutData): void {
    layoutData.tracks.forEach(trackData => {
      const trackGraphic = new PIXI.Graphics();
      trackGraphic.moveTo(trackData.points[0].x, trackData.points[0].y);
      if (trackData.type === 'curve' && trackData.points.length > 2) {
        for (let i = 1; i < trackData.points.length; i++) {
            trackGraphic.lineTo(trackData.points[i].x, trackData.points[i].y);
        }
      } else {
        trackGraphic.lineTo(trackData.points[1].x, trackData.points[1].y);
      }
      trackGraphic.stroke({ width: 4, color: theme.trackColor });
      this.app.stage.addChild(trackGraphic);
    });

    layoutData.platforms.forEach(platformData => {
      const platformGraphic = new PIXI.Graphics();
      platformGraphic.rect(
        platformData.drawingRect.x,
        platformData.drawingRect.y,
        platformData.drawingRect.width,
        platformData.drawingRect.height
      );
      platformGraphic.fill(theme.platformColor);
      this.app.stage.addChild(platformGraphic);
    });

    layoutData.signals.forEach(signalData => {
        const poi = layoutData.pois.find(p => p.id === signalData.poiId);
        if (!poi) return;

        const segment = layoutData.tracks.find(t => t.id === poi.segmentId);
        if (!segment) return;

        const signalPos = {
            x: segment.points[0].x + (segment.points[1].x - segment.points[0].x) * poi.positionOnSegment,
            y: segment.points[0].y + (segment.points[1].y - segment.points[0].y) * poi.positionOnSegment - 15
        }

        const signalGraphic = new PIXI.Graphics();
        let color = theme.signalRedColor;
        if (signalData.initialState === 'yellow') color = theme.signalYellowColor;
        if (signalData.initialState === 'blue') color = theme.signalBlueColor;
        signalGraphic.circle(signalPos.x, signalPos.y, 5);
        signalGraphic.fill(color);
        this.app.stage.addChild(signalGraphic);
    });
  }
}
