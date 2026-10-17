import React, { useState, useEffect } from 'react';
import { createInitialCalcState, pressCalcKey, type CalcState } from '../utils/retroLogic';
import { soundEngine } from '../utils/sound';

interface CalculatorAppProps {
  isActive: boolean;
}

const MAIN_GRID = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

export function CalculatorApp({ isActive }: CalculatorAppProps) {
  const [calc, setCalc] = useState<CalcState>(createInitialCalcState);

  const handleKey = (key: string) => {
    soundEngine.playClick(key === '=' ? 820 : key === 'C' ? 420 : 620);
    setCalc((prev) => pressCalcKey(prev, key));
  };

  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === '.' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleKey('=');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKey('BACK');
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleKey('C');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isActive]);

  return (
    <div className="flex flex-col h-full gap-1.5 p-0.5 select-none">
      {/* Sunken LCD Screen */}
      <div
        className="bevel-inset px-2.5 py-1.5 flex flex-col justify-between min-h-[58px] shrink-0"
        style={{ background: 'var(--lcd-bg)', color: 'var(--lcd-text)' }}
        aria-live="polite"
      >
        <div className="flex items-center justify-between text-xs font-mono-retro opacity-75 h-4">
          <span>{calc.operator ? `OP: ${calc.operator}` : 'STD CALC'}</span>
          <span className="truncate">{calc.expression}</span>
        </div>
        <div
          data-testid="calc-display"
          className="text-right font-vt text-3xl leading-none tracking-wider tabular-nums truncate"
        >
          {calc.display}
        </div>
      </div>

      {/* Top Function Row (C, CE, DEL, ±) */}
      <div className="grid grid-cols-4 gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => handleKey('C')}
          aria-label="Clear All (C)"
          className="bevel-button py-1 text-xs font-bold text-[#900000]"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handleKey('CE')}
          aria-label="Clear Entry (CE)"
          className="bevel-button py-1 text-xs font-bold text-[#900000]"
        >
          CE
        </button>
        <button
          type="button"
          onClick={() => handleKey('BACK')}
          aria-label="Backspace"
          className="bevel-button py-1 text-xs font-bold"
        >
          DEL
        </button>
        <button
          type="button"
          onClick={() => handleKey('±')}
          aria-label="Toggle Sign"
          className="bevel-button py-1 text-xs font-bold"
        >
          ±
        </button>
      </div>

      {/* 4x4 Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0">
        {MAIN_GRID.flat().map((key) => {
          const isOperator = ['/', '*', '-', '+'].includes(key);
          const isEquals = key === '=';
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleKey(key)}
              aria-label={`Calculator key ${key}`}
              className={`bevel-button py-1 text-base font-bold font-mono-retro flex items-center justify-center ${
                isEquals
                  ? 'text-[#000080]'
                  : isOperator
                  ? 'text-[#800000]'
                  : ''
              }`}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
