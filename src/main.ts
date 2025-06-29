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

    console.log(`Window dimensions: ${window.innerWidth}x${window.innerHeight}`);

    await app.init({
      canvas: canvas,
      backgroundColor: 0x1099bb, // Blue background
      width: window.innerWidth,
      height: window.innerHeight,
    });

    app.start(); // Explicitly start the PixiJS rendering loop

    console.log(`PixiJS app.screen dimensions: ${app.screen.width}x${app.screen.height}`);

    // Draw a red square
    const square = new Graphics();
    const squareSize = 100;
    const squareX = app.screen.width / 2 - squareSize / 2;
    const squareY = app.screen.height / 2 - squareSize / 2;

    console.log(`Red square position: x=${squareX}, y=${squareY}, size=${squareSize}`);

    square.fill(0xFF0000); // Red
    square.rect(squareX, squareY, squareSize, squareSize);
    app.stage.addChild(square);
    console.log("PixiJS Stage children:", app.stage.children);

    // Resize listener
    window.addEventListener('resize', () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      const newSquareX = app.screen.width / 2 - squareSize / 2;
      const newSquareY = app.screen.height / 2 - squareSize / 2;
      square.position.set(newSquareX, newSquareY);
      console.log(`Resized: Red square position: x=${newSquareX}, y=${newSquareY}`);
    });

  } else {
    console.error('Game container not found');
  }
}

initPixi();