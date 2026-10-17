import React from 'react';
import { THEME_PRESETS, type ThemeId } from '../utils/retroLogic';
import { soundEngine } from '../utils/sound';

interface ThemesAppProps {
  theme: ThemeId;
  customColor: string;
  crtEnabled: boolean;
  soundEnabled: boolean;
  onSelectTheme: (theme: ThemeId) => void;
  onChangeCustomColor: (color: string) => void;
  onToggleCrt: (enabled: boolean) => void;
  onToggleSound: (enabled: boolean) => void;
}

export function ThemesApp({
  theme,
  customColor,
  crtEnabled,
  soundEnabled,
  onSelectTheme,
  onChangeCustomColor,
  onToggleCrt,
  onToggleSound,
}: ThemesAppProps) {
  const previewBg =
    theme === 'custom'
      ? customColor
      : THEME_PRESETS[theme]?.desktopBg || THEME_PRESETS.classic95.desktopBg;

  return (
    <div className="flex flex-col h-full gap-2 p-0.5 select-none overflow-y-auto">
      {/* Mini CRT Monitor Preview */}
      <div className="bevel-inset py-2 px-3 flex flex-col items-center justify-center">
        <div className="bevel-raised p-1.5 w-44">
          <div
            className="bevel-inset h-16 w-full relative overflow-hidden p-1.5 flex flex-col justify-between"
            style={{ background: previewBg }}
          >
            <div className="bevel-raised p-0.5 w-28">
              <div
                className="h-3 px-1 flex items-center justify-between text-[8px] font-bold text-white"
                style={{ background: 'var(--titlebar-active)' }}
              >
                <span>Preview.exe</span>
                <span>[X]</span>
              </div>
              <div className="px-1 py-0.5 text-[8px] leading-tight">3D Bevel Active</div>
            </div>
            <div className="bevel-raised h-3 w-full px-1 flex items-center justify-between text-[7px] font-bold">
              <span>Start</span>
              <span>12:00 PM</span>
            </div>
          </div>
        </div>
        <div className="w-12 h-1.5 bg-[#808080] border-x border-black" />
        <div className="w-24 h-1 bg-[#404040]" />
      </div>

      {/* Preset Theme Cards */}
      <fieldset className="border border-[#808080] px-2 py-1.5 space-y-1">
        <legend className="px-1 text-xs font-bold">Desktop Color Presets</legend>
        <div className="grid grid-cols-1 gap-1">
          {(Object.keys(THEME_PRESETS) as Array<Exclude<ThemeId, 'custom'>>).map((key) => {
            const preset = THEME_PRESETS[key];
            const isSelected = theme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  soundEngine.playClick(720);
                  onSelectTheme(key);
                }}
                aria-pressed={isSelected}
                className={`bevel-button px-2 py-1 text-left flex items-center justify-between gap-2 ${
                  isSelected ? 'is-pressed font-bold' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                    <span>{isSelected ? '[*]' : '[ ]'}</span>
                    <span>{preset.name}</span>
                  </div>
                  <div className="text-[10px] opacity-80 truncate">{preset.description}</div>
                </div>
                <span
                  className="w-6 h-4 shrink-0 border border-black"
                  style={{ background: preset.desktopBg }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Custom Wallpaper Color Picker */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#808080]">
          <label htmlFor="custom-wallpaper-picker" className="text-xs font-bold cursor-pointer">
            Custom Wallpaper Color:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id="custom-wallpaper-picker"
              type="color"
              value={customColor}
              onChange={(e) => {
                onChangeCustomColor(e.target.value);
              }}
              className="w-7 h-5 p-0 border border-black cursor-pointer bg-transparent"
            />
            <span className="font-mono-retro text-xs uppercase">{customColor}</span>
          </div>
        </div>
      </fieldset>

      {/* Visual & Audio Effects Toggles */}
      <fieldset className="border border-[#808080] px-2 py-1.5 space-y-1">
        <legend className="px-1 text-xs font-bold">CRT Monitor & Sound Blaster</legend>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={crtEnabled}
              onChange={(e) => {
                soundEngine.playClick();
                onToggleCrt(e.target.checked);
              }}
              className="w-3.5 h-3.5 accent-[#000080] cursor-pointer"
            />
            <span>CRT Scanlines</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => {
                onToggleSound(e.target.checked);
              }}
              className="w-3.5 h-3.5 accent-[#000080] cursor-pointer"
            />
            <span>Synth Audio</span>
          </label>

          <button
            type="button"
            onClick={() => soundEngine.playBootChime()}
            className="bevel-button px-2 py-0.5 text-[11px] font-bold whitespace-nowrap"
          >
            Test 90s Chime
          </button>
        </div>
      </fieldset>
    </div>
  );
}
