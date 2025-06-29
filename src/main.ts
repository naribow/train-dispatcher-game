
import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';
import { Station } from './game/Station';
import { Train } from './game/Train';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Train Dispatcher: Station Flow</h1>
    <div id="game-container"></div>
  </div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;
let station: Station;
const trains: Train[] = [];
let lastTime = 0;

async function gameLoop(time: number) {
  if (!lastTime) lastTime = time;
  const deltaTime = (time - lastTime) / 1000; // 秒単位
  lastTime = time;

  // 列車の更新
  for (let i = trains.length - 1; i >= 0; i--) {
    const train = trains[i];
    const currentSegment = station.getSegment(train.currentSegmentId);

    if (currentSegment) {
      const movedToNextSegment = train.update(deltaTime, currentSegment.length);

      if (movedToNextSegment) {
        // 次のセグメントへ移動
        if (currentSegment.nextSegments.length > 0) {
          const nextSegmentId = currentSegment.nextSegments[0]; // とりあえず最初のセグメントへ
          const nextSegment = station.getSegment(nextSegmentId);
          if (nextSegment) {
            train.currentSegmentId = nextSegmentId;
            train.positionOnSegment = 0; // 新しいセグメントの開始位置
          } else {
            // 次のセグメントが見つからない場合、列車を削除
            trains.splice(i, 1);
          }
        } else {
          // 次のセグメントがない場合（駅の出口）、列車を削除
          trains.splice(i, 1);
        }
      }
    } else {
      // 現在のセグメントが見つからない場合、列車を削除
      trains.splice(i, 1);
    }
  }

  // 描画の更新
  renderer.clearStage(); // ステージをクリア
  renderer.drawStationLayout(station); // 駅のレイアウトを描画
  renderer.drawTrains(trains, station); // 列車を描画

  requestAnimationFrame(gameLoop);
}

async function initGame() {
  if (gameContainer) {
    renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);

    station = new Station();
    renderer.drawStationLayout(station); // 駅のレイアウトは一度だけ描画

    // 最初の列車を生成
    trains.push(new Train('train-1', 'segment1', 50));

    requestAnimationFrame(gameLoop);
  } else {
    console.error('Game container not found');
  }
}

initGame();
