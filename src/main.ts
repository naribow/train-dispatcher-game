import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';
import { Station } from './game/Station';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Train Dispatcher: Station Flow</h1>
    <div id="game-container"></div>
  </div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;
let station: Station;

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);

    station = new Station();
    renderer.drawStationLayout(station); // 駅のレイアウトは一度だけ描画

    console.log("main.ts: Static station layout drawn.");
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();