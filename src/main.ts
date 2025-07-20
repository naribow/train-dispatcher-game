import { PixiRenderer } from './renderer/PixiRenderer.ts';
import { stationLayoutTestData } from './game/data/StationLayoutData.ts';
import { GameState } from './game/GameState.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const renderer = new PixiRenderer();
    await renderer.init(appContainer);

    const gameState = new GameState(stationLayoutTestData);
    renderer.drawStaticLayout(stationLayoutTestData);

    // Set up signal click handling
    renderer.onSignalClick((signalId: string) => {
        const signal = gameState.station.getSignalById(signalId);
        if (signal) {
            signal.toggle();
        }
    });

    // Set up switch click handling
    renderer.onSwitchClick((switchId: string) => {
        const sw = gameState.station.getSwitchById(switchId);
        if (sw) {
            sw.togglePath();
        }
    });

    // Spawn a train every 2 seconds for testing
    setInterval(() => {
        gameState.spawnTrain();
    }, 2000);

    let lastTime = performance.now();

    function gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        gameState.update(deltaTime);
        renderer.updateDynamicElements(gameState);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  }
});

