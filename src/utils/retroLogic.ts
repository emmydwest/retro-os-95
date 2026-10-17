export type AppId = 'notepad' | 'calculator' | 'themes' | 'about' | 'source';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CalcState {
  display: string;
  expression: string;
  prevValue: number | null;
  operator: '+' | '-' | '*' | '/' | null;
  waitingForOperand: boolean;
  error: boolean;
}

export interface NoteStats {
  chars: number;
  words: number;
  lines: number;
  bytes: number;
}

export type ThemeId = 'classic95' | 'vaporwave' | 'matrix' | 'custom';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  desktopBg: string;
  surfaceGrey: string;
  titlebarActive: string;
  titlebarGradient: string;
  titlebarInactive: string;
  textMain: string;
  textLight: string;
}

export const THEME_PRESETS: Record<Exclude<ThemeId, 'custom'>, ThemePreset> = {
  classic95: {
    id: 'classic95',
    name: 'Classic 95 Teal',
    description: 'Iconic 1995 Redmond workstation teal with crisp grey 3D bevels',
    desktopBg: '#008080',
    surfaceGrey: '#c0c0c0',
    titlebarActive: '#000080',
    titlebarGradient: '#1084d0',
    titlebarInactive: '#808080',
    textMain: '#000000',
    textLight: '#ffffff',
  },
  vaporwave: {
    id: 'vaporwave',
    name: 'Vaporwave 90s',
    description: 'Aesthetic sunset gradients with pastel lavender chrome',
    desktopBg: 'linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #b967ff 100%)',
    surfaceGrey: '#f3e6ff',
    titlebarActive: '#b967ff',
    titlebarGradient: '#ff71ce',
    titlebarInactive: '#9a84a8',
    textMain: '#1e0933',
    textLight: '#ffffff',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Cyber',
    description: 'High-contrast phosphor green terminal aesthetic for night hacking',
    desktopBg: '#050a05',
    surfaceGrey: '#112211',
    titlebarActive: '#008800',
    titlebarGradient: '#003300',
    titlebarInactive: '#1a331a',
    textMain: '#00ff41',
    textLight: '#e0ffe0',
  },
};

export function createInitialCalcState(): CalcState {
  return {
    display: '0',
    expression: '',
    prevValue: null,
    operator: null,
    waitingForOperand: false,
    error: false,
  };
}

export function formatCalcNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'ERR: DIV/0';
  }
  const rounded = Math.round(value * 1e10) / 1e10;
  const str = String(rounded);
  if (str.length > 12) {
    return rounded.toPrecision(8);
  }
  return str;
}

export function calculateBinary(left: number, right: number, op: '+' | '-' | '*' | '/'): number {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? NaN : left / right;
  }
}

export function pressCalcKey(state: CalcState, key: string): CalcState {
  if (key === 'C') {
    return createInitialCalcState();
  }

  if (key === 'CE') {
    if (state.error) return createInitialCalcState();
    return {
      ...state,
      display: '0',
    };
  }

  if (state.error) {
    if (/^[0-9]$/.test(key)) {
      return {
        ...createInitialCalcState(),
        display: key,
      };
    }
    return state;
  }

  if (/^[0-9]$/.test(key)) {
    if (state.waitingForOperand) {
      return {
        ...state,
        display: key,
        waitingForOperand: false,
      };
    }
    if (state.display.replace('-', '').replace('.', '').length >= 11) {
      return state;
    }
    return {
      ...state,
      display: state.display === '0' ? key : state.display + key,
    };
  }

  if (key === '.') {
    if (state.waitingForOperand) {
      return {
        ...state,
        display: '0.',
        waitingForOperand: false,
      };
    }
    if (!state.display.includes('.')) {
      return {
        ...state,
        display: state.display + '.',
      };
    }
    return state;
  }

  if (key === '±') {
    const current = parseFloat(state.display);
    if (current === 0) return state;
    return {
      ...state,
      display: formatCalcNumber(current * -1),
    };
  }

  if (key === 'BACK') {
    if (state.waitingForOperand) return state;
    if (state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
      return { ...state, display: '0' };
    }
    return { ...state, display: state.display.slice(0, -1) };
  }

  if (key === '+' || key === '-' || key === '*' || key === '/') {
    const inputValue = parseFloat(state.display);

    if (state.prevValue === null) {
      return {
        ...state,
        prevValue: inputValue,
        operator: key,
        waitingForOperand: true,
        expression: `${formatCalcNumber(inputValue)} ${key}`,
      };
    }

    if (state.operator && !state.waitingForOperand) {
      const result = calculateBinary(state.prevValue, inputValue, state.operator);
      if (!Number.isFinite(result)) {
        return {
          display: 'ERR: DIV/0',
          expression: `${formatCalcNumber(state.prevValue)} ${state.operator} ${formatCalcNumber(inputValue)} =`,
          prevValue: null,
          operator: null,
          waitingForOperand: true,
          error: true,
        };
      }
      const formatted = formatCalcNumber(result);
      return {
        display: formatted,
        prevValue: result,
        operator: key,
        waitingForOperand: true,
        expression: `${formatted} ${key}`,
        error: false,
      };
    }

    return {
      ...state,
      operator: key,
      waitingForOperand: true,
      expression: `${formatCalcNumber(state.prevValue)} ${key}`,
    };
  }

  if (key === '=') {
    if (state.operator === null || state.prevValue === null) {
      return state;
    }
    const inputValue = parseFloat(state.display);
    const result = calculateBinary(state.prevValue, inputValue, state.operator);
    if (!Number.isFinite(result)) {
      return {
        display: 'ERR: DIV/0',
        expression: `${formatCalcNumber(state.prevValue)} ${state.operator} ${formatCalcNumber(inputValue)} =`,
        prevValue: null,
        operator: null,
        waitingForOperand: true,
        error: true,
      };
    }
    const formatted = formatCalcNumber(result);
    return {
      display: formatted,
      expression: `${formatCalcNumber(state.prevValue)} ${state.operator} ${formatCalcNumber(inputValue)} =`,
      prevValue: null,
      operator: null,
      waitingForOperand: true,
      error: false,
    };
  }

  return state;
}

export function computeNoteStats(text: string): NoteStats {
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const lines = text.length === 0 ? 1 : text.split(/\r\n|\r|\n/).length;
  const bytes = new TextEncoder().encode(text).length;
  return { chars, words, lines, bytes };
}

export function clampWindowPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  const maxX = Math.max(0, viewportWidth - 100);
  const maxY = Math.max(0, viewportHeight - 60);
  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  };
}

export function getHighestZ(windows: WindowState[]): number {
  return windows.reduce((max, w) => Math.max(max, w.zIndex), 10);
}

export function getActiveWindowId(windows: WindowState[]): AppId | null {
  const visible = windows.filter((w) => w.isOpen && !w.isMinimized);
  if (visible.length === 0) return null;
  return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top), visible[0]).id;
}

export function focusWindowState(windows: WindowState[], id: AppId): WindowState[] {
  const nextZ = getHighestZ(windows) + 1;
  return windows.map((w) =>
    w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ } : w
  );
}

export function closeWindowState(windows: WindowState[], id: AppId): WindowState[] {
  return windows.map((w) =>
    w.id === id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w
  );
}

export function minimizeWindowState(windows: WindowState[], id: AppId): WindowState[] {
  return windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
}

export function toggleTaskbarWindowState(windows: WindowState[], id: AppId): WindowState[] {
  const target = windows.find((w) => w.id === id);
  if (!target || !target.isOpen) {
    return focusWindowState(windows, id);
  }
  const activeId = getActiveWindowId(windows);
  if (target.isMinimized || activeId !== id) {
    return focusWindowState(windows, id);
  }
  return minimizeWindowState(windows, id);
}
