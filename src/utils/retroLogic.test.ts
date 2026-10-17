import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialCalcState,
  pressCalcKey,
  computeNoteStats,
  clampWindowPosition,
  focusWindowState,
  closeWindowState,
  minimizeWindowState,
  toggleTaskbarWindowState,
  getActiveWindowId,
  type WindowState,
} from './retroLogic.ts';

test('calculator handles basic arithmetic and decimal operations accurately', () => {
  let state = createInitialCalcState();
  for (const key of ['7', '*', '8', '=']) {
    state = pressCalcKey(state, key);
  }
  assert.equal(state.display, '56');
  assert.equal(state.expression, '7 * 8 =');

  // Chained decimal addition (0.1 + 0.2 = 0.3 without float artifacts)
  state = pressCalcKey(state, 'C');
  for (const key of ['0', '.', '1', '+', '0', '.', '2', '=']) {
    state = pressCalcKey(state, key);
  }
  assert.equal(state.display, '0.3');
});

test('calculator handles division by zero gracefully and recovers on Clear', () => {
  let state = createInitialCalcState();
  for (const key of ['9', '/', '0', '=']) {
    state = pressCalcKey(state, key);
  }
  assert.equal(state.display, 'ERR: DIV/0');
  assert.equal(state.error, true);

  state = pressCalcKey(state, '5');
  assert.equal(state.display, '5');
  assert.equal(state.error, false);
});

test('computeNoteStats calculates characters, words, lines, and bytes', () => {
  const emptyStats = computeNoteStats('');
  assert.equal(emptyStats.chars, 0);
  assert.equal(emptyStats.words, 0);
  assert.equal(emptyStats.lines, 1);

  const sample = 'Welcome to RetroOS 95!\nBuild cool nostalgic web apps.';
  const stats = computeNoteStats(sample);
  assert.equal(stats.chars, sample.length);
  assert.equal(stats.words, 9);
  assert.equal(stats.lines, 2);
  assert.equal(stats.bytes, sample.length);
});

test('window manager z-index focus, minimize, taskbar toggle, and viewport clamping', () => {
  const initialWindows: WindowState[] = [
    {
      id: 'notepad',
      title: 'Notepad.exe',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      x: 100,
      y: 60,
      width: 520,
      height: 400,
    },
    {
      id: 'calculator',
      title: 'Calculator.exe',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      x: 300,
      y: 120,
      width: 260,
      height: 350,
    },
  ];

  assert.equal(getActiveWindowId(initialWindows), 'calculator');

  // Focus notepad brings it above calculator
  const afterFocus = focusWindowState(initialWindows, 'notepad');
  assert.equal(getActiveWindowId(afterFocus), 'notepad');
  assert.equal(afterFocus.find((w) => w.id === 'notepad')?.zIndex, 13);

  // Clicking active window tab on taskbar minimizes it
  const afterTaskbarToggle = toggleTaskbarWindowState(afterFocus, 'notepad');
  assert.equal(afterTaskbarToggle.find((w) => w.id === 'notepad')?.isMinimized, true);
  assert.equal(getActiveWindowId(afterTaskbarToggle), 'calculator');

  // Clicking minimized window tab on taskbar restores and focuses it
  const afterRestore = toggleTaskbarWindowState(afterTaskbarToggle, 'notepad');
  assert.equal(afterRestore.find((w) => w.id === 'notepad')?.isMinimized, false);
  assert.equal(getActiveWindowId(afterRestore), 'notepad');

  // Closing window removes it from active consideration
  const afterClose = closeWindowState(afterRestore, 'notepad');
  assert.equal(afterClose.find((w) => w.id === 'notepad')?.isOpen, false);
  assert.equal(getActiveWindowId(afterClose), 'calculator');

  // Viewport clamping keeps window inside bounds
  const clamped = clampWindowPosition(-50, 2000, 1440, 900);
  assert.equal(clamped.x, 0);
  assert.equal(clamped.y, 840);
});
