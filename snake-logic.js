export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(random = Math.random) {
  const center = Math.floor(GRID_SIZE / 2);
  const snake = [{ x: center, y: center }];
  return {
    gridSize: GRID_SIZE,
    snake,
    direction: 'right',
    queuedDirection: 'right',
    food: placeFood(snake, GRID_SIZE, random),
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function setDirection(state, nextDirection) {
  if (state.gameOver) return state;
  if (!DIRECTIONS[nextDirection]) return state;

  const current = state.queuedDirection || state.direction;
  if (OPPOSITES[current] === nextDirection) {
    return state;
  }

  return { ...state, queuedDirection: nextDirection };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function stepGame(state, random = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.queuedDirection || state.direction;
  const head = state.snake[0];
  const delta = DIRECTIONS[direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (isOutOfBounds(nextHead, state.gridSize)) {
    return { ...state, direction, gameOver: true };
  }

  const willEat = positionsEqual(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  if (isOnSnake(nextHead, bodyToCheck)) {
    return { ...state, direction, gameOver: true };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  return {
    ...state,
    direction,
    snake: nextSnake,
    food: willEat ? placeFood(nextSnake, state.gridSize, random) : state.food,
    score: willEat ? state.score + 1 : state.score,
  };
}

export function placeFood(snake, gridSize, random = Math.random) {
  const freeCells = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const pos = { x, y };
      if (!isOnSnake(pos, snake)) {
        freeCells.push(pos);
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const idx = Math.floor(random() * freeCells.length);
  return freeCells[idx];
}

export function isOutOfBounds(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function isOnSnake(position, snake) {
  return snake.some((segment) => positionsEqual(segment, position));
}

export function positionsEqual(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}
