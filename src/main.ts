import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Train Dispatcher: Station Flow</h1>
    <div id="game-container"></div>
  </div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    const renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);
    renderer.drawRedSquare();
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();