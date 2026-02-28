import {
  GRID_SIZE,
  createInitialState,
  setDirection,
  stepGame,
  togglePause,
} from './snake-logic.js';

const TICK_MS = 440;

const gridEl = document.querySelector('[data-grid]');
const scoreEl = document.querySelector('[data-score]');
const statusEl = document.querySelector('[data-status]');
const restartBtn = document.querySelector('[data-action="restart"]');
const pauseBtn = document.querySelector('[data-action="pause"]');

const controlMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

let state = createInitialState();

function restart() {
  state = createInitialState();
  render();
}

function handleDirectionInput(dir) {
  state = setDirection(state, dir);
  render();
}

function handleKeydown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  const dir = controlMap[key];
  if (!dir) return;

  event.preventDefault();
  handleDirectionInput(dir);
}

function tick() {
  state = stepGame(state);
  render();
}

function renderGrid() {
  gridEl.innerHTML = '';

  const snakeCells = new Set(state.snake.map((s) => `${s.x},${s.y}`));
  const foodKey = state.food ? `${state.food.x},${state.food.y}` : '';

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const key = `${x},${y}`;

      if (snakeCells.has(key)) {
        cell.classList.add('snake');
        if (key === `${state.snake[0].x},${state.snake[0].y}`) {
          cell.classList.add('head');
        }
      } else if (key === foodKey) {
        cell.classList.add('food');
      }

      gridEl.appendChild(cell);
    }
  }
}

function render() {
  renderGrid();
  scoreEl.textContent = String(state.score);

  if (state.gameOver) {
    statusEl.textContent = 'Game over';
    pauseBtn.textContent = 'Pause';
  } else if (state.paused) {
    statusEl.textContent = 'Paused';
    pauseBtn.textContent = 'Resume';
  } else {
    statusEl.textContent = 'Running';
    pauseBtn.textContent = 'Pause';
  }
}

restartBtn.addEventListener('click', restart);
pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

document.querySelectorAll('[data-dir]').forEach((button) => {
  button.addEventListener('click', () => {
    handleDirectionInput(button.dataset.dir);
  });
});

window.addEventListener('keydown', handleKeydown);

setInterval(tick, TICK_MS);
render();
