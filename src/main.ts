import './style.css';
import { PixiRenderer } from './renderer/PixiRenderer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-container"></div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

let renderer: PixiRenderer;
let squareX: number; // 四角形のX座標
const squareSize = 100; // 四角形のサイズ
let squareSpeed = 100; // 四角形の移動速度 (pixels/second)
let direction = -1; // -1: 左, 1: 右
let lastTime = 0;

async function gameLoop(time: number) {
  if (!lastTime) lastTime = time;
  const deltaTime = (time - lastTime) / 1000; // 秒単位
  lastTime = time;

  // 四角形の位置を更新
  squareX += squareSpeed * direction * deltaTime;

  // 画面の端に到達したら方向を反転
  if (squareX <= 0 || squareX + squareSize >= window.innerWidth) {
    direction *= -1; // 方向を反転
    // 画面外に出ないように位置を調整
    if (squareX < 0) squareX = 0;
    if (squareX + squareSize > window.innerWidth) squareX = window.innerWidth - squareSize;
  }

  // 描画をクリアして再描画
  renderer.clearLayout();
  renderer.drawMovingSquare(squareX, window.innerHeight / 2 - squareSize / 2, squareSize);

  requestAnimationFrame(gameLoop);
}

async function initGame() {
  console.log("main.ts: initGame called.");
  if (gameContainer) {
    renderer = new PixiRenderer(window.innerWidth, window.innerHeight);
    await renderer.init(gameContainer);

    // 四角形の初期位置を設定 (右端から開始)
    squareX = window.innerWidth - squareSize;

    requestAnimationFrame(gameLoop);
    console.log("main.ts: Game loop started.");
  } else {
    console.error('main.ts: Game container not found');
  }
}

initGame();