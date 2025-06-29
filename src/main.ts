
import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';
import { Station } from './game/Station'; // 再追加

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-container"></div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    renderer = new PixiRenderer(); // 引数を削除
    await renderer.init(gameContainer);

    // stationLayoutContainerをここでクリア
    renderer.stationLayoutContainer.removeChildren();
    console.log("main.ts: stationLayoutContainer cleared.");

    // 1つ目の駅を描画
    let station1 = new Station('simple', 50, 100, 500, 50); // ホームx, ホームy, ホーム幅, ホーム高さ
    renderer.drawStationLayout(station1);

    // 2つ目の駅を描画
    let station2 = new Station('simple', 50, 400, 500, 50); // ホームx, ホームy, ホーム幅, ホーム高さ
    renderer.drawStationLayout(station2);

    console.log("main.ts: Multiple static station layouts drawn.");
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();
