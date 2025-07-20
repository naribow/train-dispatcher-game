import * as PIXI from 'pixi.js';
import type { StationLayoutData } from '../game/data/StationLayoutData.ts';
import type { TrackSegmentData } from '../game/data/TrackSegmentData.ts';
import type { PlatformData } from '../game/data/PlatformData.ts';
import type { SignalData } from '../game/data/SignalData.ts';
import type { PointOfInterestData } from '../game/data/PointOfInterestData.ts';
import type { SwitchData } from '../game/data/SwitchData.ts';
import { theme } from './ThemeManager.ts';
import type { GameState } from '../game/GameState.ts';
import type { Train } from '../game/Train.ts'; // Add this import

export class PixiRenderer {
  private app: PIXI.Application;
  private trainGraphics: Map<string, PIXI.Graphics> = new Map();
  private trackGraphics: Map<string, PIXI.Graphics> = new Map();
  private signalGraphics: Map<string, PIXI.Graphics> = new Map();
  private switchGraphics: Map<string, PIXI.Graphics> = new Map();

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
    layoutData.tracks.forEach((trackData: TrackSegmentData) => {
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
      this.trackGraphics.set(trackData.id, trackGraphic);
    });

    layoutData.platforms.forEach((platformData: PlatformData) => {
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

    // Initial drawing of signals (will be updated dynamically)
    layoutData.signals.forEach((signalData: SignalData) => {
        const poi = layoutData.pois.find((p: PointOfInterestData) => p.id === signalData.poiId);
        if (!poi) return;

        const segment = layoutData.tracks.find((t: TrackSegmentData) => t.id === poi.segmentId);
        if (!segment) return;

        const signalPos = {
            x: segment.points[0].x + (segment.points[1].x - segment.points[0].x) * poi.positionOnSegment,
            y: segment.points[0].y + (segment.points[1].y - segment.points[0].y) * poi.positionOnSegment - 15
        }

        const signalGraphic = new PIXI.Graphics();
        signalGraphic.position.set(signalPos.x, signalPos.y);
        signalGraphic.eventMode = 'static'; // Enable interactivity
        signalGraphic.cursor = 'pointer'; // Show pointer cursor on hover
        signalGraphic.label = signalData.id; // Store signal ID for event handling
        this.app.stage.addChild(signalGraphic);
        this.signalGraphics.set(signalData.id, signalGraphic);
    });

    // Initial drawing of switches (will be updated dynamically)
    layoutData.switches.forEach((switchData: SwitchData) => {
        const poi = layoutData.pois.find((p: PointOfInterestData) => p.id === switchData.poiId);
        if (!poi) return;

        const segment = layoutData.tracks.find((t: TrackSegmentData) => t.id === poi.segmentId);
        if (!segment) return;

        const switchPos = {
            x: segment.points[0].x + (segment.points[1].x - segment.points[0].x) * poi.positionOnSegment,
            y: segment.points[0].y + (segment.points[1].y - segment.points[0].y) * poi.positionOnSegment
        }

        const switchGraphic = new PIXI.Graphics();
        switchGraphic.position.set(switchPos.x, switchPos.y);
        switchGraphic.eventMode = 'static';
        switchGraphic.cursor = 'pointer';
        switchGraphic.label = switchData.id; // Store switch ID for event handling
        this.app.stage.addChild(switchGraphic);
        this.switchGraphics.set(switchData.id, switchGraphic);
    });
  }

  public updateDynamicElements(gameState: GameState): void {
    const stationLayout = gameState.station.getLayoutData();

    // Update track colors based on occupancy
    stationLayout.tracks.forEach((track: TrackSegmentData) => {
        const graphic = this.trackGraphics.get(track.id);
        if (graphic) {
            graphic.tint = track.occupiedBy ? 0xff0000 : 0xffffff;
        }
    });

    // Update train positions
    gameState.trains.forEach((train: Train) => {
      let trainGraphic = this.trainGraphics.get(train.id);
      if (!trainGraphic) {
        trainGraphic = new PIXI.Graphics();
        this.trainGraphics.set(train.id, trainGraphic);
        this.app.stage.addChild(trainGraphic);
      }

      const segment = gameState.station.getTrackSegmentById(train.currentSegmentId);
      if (!segment) return;

      // Calculate the actual length of the segment from its points for precise positioning
      let actualSegmentLength = 0;
      for (let i = 0; i < segment.points.length - 1; i++) {
        const p1 = segment.points[i];
        const p2 = segment.points[i+1];
        actualSegmentLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      }

      // Calculate position on multi-point segment using the actual length
      const traveledDistance = actualSegmentLength * train.positionOnSegment;
      let distanceCovered = 0;
      let finalPos = { x: segment.points[0].x, y: segment.points[0].y };

      for (let i = 0; i < segment.points.length - 1; i++) {
        const p1 = segment.points[i];
        const p2 = segment.points[i+1];
        const subSegmentLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

        if (traveledDistance <= distanceCovered + subSegmentLength) {
            const distanceOnSubSegment = traveledDistance - distanceCovered;
            const percentage = subSegmentLength > 0 ? distanceOnSubSegment / subSegmentLength : 0;
            finalPos = {
                x: p1.x + (p2.x - p1.x) * percentage,
                y: p1.y + (p2.y - p1.y) * percentage
            };
            break;
        }
        distanceCovered += subSegmentLength;
      }

      trainGraphic.clear();
      trainGraphic.rect(-10, -5, 20, 10);
      trainGraphic.fill(train.color);
      trainGraphic.position.set(finalPos.x, finalPos.y);
    });

    // Update signal colors
    stationLayout.signals.forEach((signalData: SignalData) => {
        const graphic = this.signalGraphics.get(signalData.id);
        if (graphic) {
            graphic.clear();
            let color = theme.signalRedColor;
            if (signalData.initialState === 'yellow') color = theme.signalYellowColor;
            if (signalData.initialState === 'blue') color = theme.signalBlueColor;
            graphic.circle(0, 0, 5); // Draw at local position (0,0) as graphic.position is already set
            graphic.fill(color);
        }
    });

    // Update switch paths and highlight selected path
    stationLayout.switches.forEach((switchData: SwitchData) => {
        const graphic = this.switchGraphics.get(switchData.id);
        if (graphic) {
            graphic.clear();
            // Draw a simple representation of the switch
            graphic.rect(-5, -5, 10, 10); // Placeholder for the switch body
            graphic.fill(0x00ff00); // Green for active switch

            // Highlight the selected path
            const currentSwitch = gameState.station.getSwitchById(switchData.id);
            if (currentSwitch) {
                const pathPoints = currentSwitch.getCurrentPathControlPoints();
                if (pathPoints.length > 1) {
                    graphic.stroke({ width: 3, color: 0x00ffff }); // Cyan for highlighted path
                    graphic.moveTo(pathPoints[0].x - graphic.position.x, pathPoints[0].y - graphic.position.y);
                    for (let i = 1; i < pathPoints.length; i++) {
                        graphic.lineTo(pathPoints[i].x - graphic.position.x, pathPoints[i].y - graphic.position.y);
                    }
                }
            }
        }
    });

    // Remove graphics for despawned trains
    this.trainGraphics.forEach((graphic, trainId) => {
        if (!gameState.trains.has(trainId)) {
            graphic.destroy();
            this.trainGraphics.delete(trainId);
        }
    });
  }

  public onSignalClick(callback: (signalId: string) => void): void {
    this.signalGraphics.forEach(graphic => {
        graphic.on('pointerdown', () => {
            if (graphic.label) {
                callback(graphic.label);
            }
        });
    });
  }

  public onSwitchClick(callback: (switchId: string) => void): void {
    this.switchGraphics.forEach(graphic => {
        graphic.on('pointerdown', () => {
            if (graphic.label) {
                callback(graphic.label);
            }
        });
    });
  }
}
