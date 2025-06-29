
import './style.css';
import { Application, Graphics } from 'pixi.js';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Train Dispatcher: Station Flow</h1>
    <div id="game-container"></div>
  </div>
`;

const gameContainer = document.querySelector<HTMLDivElement>('#game-container');

async function initPixi() {
  if (gameContainer) {
    const app = new Application();

    // Explicitly create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameContainer.appendChild(canvas);

    await app.init({
      canvas: canvas,
      backgroundColor: 0x1099bb, // Blue background
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Draw a red square
    const square = new Graphics();
    square.fill(0xFF0000); // Red
    square.rect(app.screen.width / 2 - 50, app.screen.height / 2 - 50, 100, 100);
    app.stage.addChild(square);

    // Resize listener
    window.addEventListener('resize', () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      square.position.set(app.screen.width / 2 - 50, app.screen.height / 2 - 50);
    });

  } else {
    console.error('Game container not found');
  }
}

initPixi();
