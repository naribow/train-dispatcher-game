import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';
import { Station } from './game/Station'; // 再追加

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-container"></div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;
let station: Station; // 再追加

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);

    station = new Station('simple'); // simpleレイアウトをロード
    renderer.drawStationLayout(station); // 駅のレイアウトを描画

    console.log("main.ts: Static station layout drawn.");
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();