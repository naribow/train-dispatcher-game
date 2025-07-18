import { PixiRenderer } from './renderer/PixiRenderer.ts';
import { stationLayoutTestData } from './game/data/StationLayoutData.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const renderer = new PixiRenderer();
    await renderer.init(appContainer);
    renderer.drawStaticLayout(stationLayoutTestData);
  }
});
