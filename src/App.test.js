import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.vue';

function findButton(wrapper, label) {
  const buttons = wrapper.findAll('button');
  const match = buttons.find((button) => button.text() === label);
  if (!match) {
    throw new Error(`Button not found: ${label}`);
  }
  return match;
}

describe('App speed controls', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('allows speed changes before start and locks after start', async () => {
    const wrapper = mount(App);
    const select = wrapper.get('select#speed-select');

    expect(select.element.disabled).toBe(false);

    const startButton = findButton(wrapper, 'Start');
    await startButton.trigger('click');

    expect(select.element.disabled).toBe(true);
  });

  it('re-enables speed selection after restart', async () => {
    const wrapper = mount(App);
    const select = wrapper.get('select#speed-select');

    await findButton(wrapper, 'Start').trigger('click');
    expect(select.element.disabled).toBe(true);

    await findButton(wrapper, 'Restart').trigger('click');
    expect(select.element.disabled).toBe(false);
  });

  it('shows Ready before start and Running after start', async () => {
    const wrapper = mount(App);

    expect(wrapper.get('[data-status]').text()).toBe('Ready');

    await findButton(wrapper, 'Start').trigger('click');
    expect(wrapper.get('[data-status]').text()).toBe('Running');
  });
});
