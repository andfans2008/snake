import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  setDirection,
  stepGame,
  placeFood,
  GRID_SIZE,
} from './snake-logic.js';

const fixedRandom = (value) => () => value;

test('moves one cell in current direction', () => {
  const initial = createInitialState(fixedRandom(0));
  const next = stepGame(initial, fixedRandom(0));

  assert.equal(next.snake[0].x, initial.snake[0].x + 1);
  assert.equal(next.snake[0].y, initial.snake[0].y);
  assert.equal(next.score, 0);
});

test('cannot reverse direction directly', () => {
  const initial = createInitialState(fixedRandom(0));
  const withReverse = setDirection(initial, 'left');
  const next = stepGame(withReverse, fixedRandom(0));

  assert.equal(next.direction, 'right');
});

test('grows and increments score when eating food', () => {
  const state = {
    ...createInitialState(fixedRandom(0)),
    snake: [{ x: 5, y: 5 }],
    direction: 'right',
    queuedDirection: 'right',
    food: { x: 6, y: 5 },
    score: 0,
  };

  const next = stepGame(state, fixedRandom(0));

  assert.equal(next.snake.length, 2);
  assert.equal(next.score, 1);
});

test('game over when snake hits wall', () => {
  const state = {
    ...createInitialState(fixedRandom(0)),
    snake: [{ x: GRID_SIZE - 1, y: 0 }],
    direction: 'right',
    queuedDirection: 'right',
  };

  const next = stepGame(state, fixedRandom(0));
  assert.equal(next.gameOver, true);
});

test('game over when snake hits itself', () => {
  const state = {
    ...createInitialState(fixedRandom(0)),
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    direction: 'left',
    queuedDirection: 'left',
    food: { x: 0, y: 0 },
  };

  const next = stepGame(state, fixedRandom(0));
  assert.equal(next.gameOver, true);
});

test('food placement avoids snake cells', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  const food = placeFood(snake, 2, fixedRandom(0));

  assert.deepEqual(food, { x: 0, y: 1 });
});
