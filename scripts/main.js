import { setupGame } from './setup.js';
import { render } from './render.js';

document.addEventListener("DOMContentLoaded", (event) => {
  let gameState = setupGame();
  render(gameState, render);
})