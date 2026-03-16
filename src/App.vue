<template>
  <main class="container">
    <h1>Snake</h1>
    <section class="hud">
      <p>Score: <strong>{{ state.score }}</strong></p>
      <p>Status: <strong>{{ statusText }}</strong></p>
    </section>

    <section class="board" data-grid aria-label="Snake board">
      <div
        v-for="cell in cells"
        :key="cell.key"
        class="cell"
        :class="cellClass(cell)"
      ></div>
    </section>

    <section class="actions">
      <button type="button" @click="togglePauseAction">{{ pauseLabel }}</button>
      <button type="button" @click="restart">Restart</button>
    </section>

    <section class="controls" aria-label="Direction controls">
      <button type="button" @click="handleDirectionInput('up')">Up</button>
      <div>
        <button type="button" @click="handleDirectionInput('left')">Left</button>
        <button type="button" @click="handleDirectionInput('down')">Down</button>
        <button type="button" @click="handleDirectionInput('right')">Right</button>
      </div>
    </section>

    <p class="hint">Controls: Arrow keys / WASD, Space to pause.</p>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  GRID_SIZE,
  createInitialState,
  setDirection,
  stepGame,
  togglePause,
} from './snake-logic.js';

const TICK_MS = 440;

const state = ref(createInitialState());

const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
  const x = index % GRID_SIZE;
  const y = Math.floor(index / GRID_SIZE);
  return { x, y, key: `${x},${y}` };
});

const statusText = computed(() => {
  if (state.value.gameOver) return 'Game over';
  if (state.value.paused) return 'Paused';
  return 'Running';
});

const pauseLabel = computed(() => {
  if (state.value.gameOver) return 'Pause';
  return state.value.paused ? 'Resume' : 'Pause';
});

const snakeKeys = computed(
  () => new Set(state.value.snake.map((s) => `${s.x},${s.y}`))
);

const headKey = computed(() => {
  const head = state.value.snake[0];
  return head ? `${head.x},${head.y}` : '';
});

const foodKey = computed(() => {
  const food = state.value.food;
  return food ? `${food.x},${food.y}` : '';
});

function cellClass(cell) {
  return {
    snake: snakeKeys.value.has(cell.key),
    head: cell.key === headKey.value,
    food: cell.key === foodKey.value,
  };
}

function restart() {
  state.value = createInitialState();
}

function handleDirectionInput(dir) {
  state.value = setDirection(state.value, dir);
}

function togglePauseAction() {
  state.value = togglePause(state.value);
}

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

function handleKeydown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === ' ') {
    event.preventDefault();
    togglePauseAction();
    return;
  }

  const dir = controlMap[key];
  if (!dir) return;

  event.preventDefault();
  handleDirectionInput(dir);
}

function tick() {
  state.value = stepGame(state.value);
}

let timerId = null;

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  timerId = window.setInterval(tick, TICK_MS);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
});
</script>
