import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Train Dispatcher: Station Flow</h1>
    <div id="game-container"></div>
  </div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);

    // station = new Station(); // Stationはまだ必要なので残す (コメントアウト)
    renderer.drawStationLayout(); // 引数を削除

    console.log("main.ts: Static station layout drawn.");
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();