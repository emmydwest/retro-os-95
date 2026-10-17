import React, { useState, useEffect, useRef } from 'react';
import type { AppId, WindowState } from '../utils/retroLogic';
import { AppIcon, SpeakerIcon, StartFlagIcon } from './RetroIcons';
import { soundEngine } from '../utils/sound';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: AppId | null;
  soundEnabled: boolean;
  crtEnabled: boolean;
  onToggleTaskbarTab: (id: AppId) => void;
  onOpenApp: (id: AppId) => void;
  onToggleSound: (enabled: boolean) => void;
  onToggleCrt: (enabled: boolean) => void;
  onReboot: () => void;
}

const START_MENU_ITEMS: Array<{ id: AppId; label: string; subtitle: string }> = [
  { id: 'notepad', label: 'Notepad.exe', subtitle: 'Persistent Text Editor' },
  { id: 'calculator', label: 'Calc.exe', subtitle: 'Pocket LCD Calculator' },
  { id: 'themes', label: 'Themes.cpl', subtitle: 'Display & CRT Properties' },
  { id: 'about', label: 'About_Me.exe', subtitle: 'Developer Bio & Projects' },
  { id: 'source', label: 'Source_Code.exe', subtitle: 'Grab Vanilla HTML/CSS/JS' },
];

export function Taskbar({
  windows,
  activeWindowId,
  soundEnabled,
  crtEnabled,
  onToggleTaskbarTab,
  onOpenApp,
  onToggleSound,
  onToggleCrt,
  onReboot,
}: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [clockText, setClockText] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const startContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!startOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (startContainerRef.current && !startContainerRef.current.contains(e.target as Node)) {
        setStartOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [startOpen]);

  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <div ref={startContainerRef}>
      {/* Start Menu Popup */}
      {startOpen && (
        <div
          role="menu"
          aria-label="Start Menu"
          className="bevel-raised fixed bottom-[36px] left-0 z-[9500] w-64 flex p-1 select-none"
        >
          {/* Vertical Side Banner */}
          <div
            className="w-7 flex items-end justify-center pb-2 text-white font-bold tracking-widest"
            style={{
              background: 'linear-gradient(180deg, var(--titlebar-active) 0%, #000000 100%)',
            }}
          >
            <span
              className="text-sm whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              RetroOS <span className="font-normal opacity-80">95</span>
            </span>
          </div>

          {/* Menu Items */}
          <div className="flex-1 flex flex-col divide-y divide-[#808080] pl-1">
            <div className="py-1 space-y-0.5">
              {START_MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    soundEngine.playWindowOpen();
                    onOpenApp(item.id);
                    setStartOpen(false);
                  }}
                  className="w-full px-2 py-1.5 flex items-center gap-2.5 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
                >
                  <AppIcon appId={item.id} size={24} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">{item.label}</div>
                    <div className="text-[10px] opacity-80 truncate">{item.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="py-1 space-y-0.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  soundEngine.playClick();
                  onToggleCrt(!crtEnabled);
                  setStartOpen(false);
                }}
                className="w-full px-2 py-1.5 flex items-center justify-between text-xs hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>CRT Scanlines</span>
                <span className="font-mono-retro font-bold">{crtEnabled ? '[ON]' : '[OFF]'}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onReboot();
                  setStartOpen(false);
                }}
                className="w-full px-2 py-1.5 flex items-center justify-between text-xs font-bold hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>Reboot BIOS Screen...</span>
                <span className="font-mono-retro">F5</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Taskbar (height: 36px) */}
      <footer
        id="taskbar"
        className="bevel-raised fixed bottom-0 left-0 right-0 h-[36px] z-[9000] px-1.5 flex items-center justify-between gap-1.5 select-none"
      >
        {/* Start Button */}
        <button
          id="start-btn"
          type="button"
          aria-expanded={startOpen}
          onClick={() => {
            soundEngine.playClick(640);
            setStartOpen((prev) => !prev);
          }}
          className={`bevel-button h-[26px] px-2.5 flex items-center gap-1.5 font-bold text-xs shrink-0 ${
            startOpen ? 'is-pressed' : ''
          }`}
        >
          <StartFlagIcon size={16} />
          <span>Start</span>
        </button>

        <div className="w-[2px] h-5 bg-[#808080] border-r border-white shrink-0" />

        {/* Dynamic Open Window Tabs */}
        <div
          id="active-tabs"
          className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0 py-0.5"
        >
          {openWindows.map((w) => {
            const isTabActive = activeWindowId === w.id && !w.isMinimized;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(580);
                  onToggleTaskbarTab(w.id);
                }}
                className={`h-[26px] px-1.5 sm:px-2.5 flex items-center gap-1 sm:gap-1.5 text-xs flex-1 min-w-[52px] max-w-[168px] truncate cursor-pointer ${
                  isTabActive ? 'taskbar-tab-active' : 'bevel-button'
                }`}
              >
                <AppIcon appId={w.id} size={14} />
                <span className="truncate">{w.title}</span>
              </button>
            );
          })}
        </div>

        {/* Sunken System Tray with Sound Toggle & Live Clock */}
        <div className="system-tray bevel-inset h-[26px] px-2 flex items-center gap-2 shrink-0 bg-[var(--surface-grey)]">
          <button
            type="button"
            onClick={() => onToggleSound(!soundEnabled)}
            aria-label={soundEnabled ? 'Mute Retro Synth Audio' : 'Unmute Retro Synth Audio'}
            title={soundEnabled ? 'Sound Blaster: ON' : 'Sound Blaster: MUTED'}
            className="cursor-pointer flex items-center justify-center"
          >
            <SpeakerIcon muted={!soundEnabled} size={15} />
          </button>
          <span
            id="clock"
            data-testid="taskbar-clock"
            className="text-xs font-mono-retro font-bold tabular-nums whitespace-nowrap"
          >
            {clockText}
          </span>
        </div>
      </footer>
    </div>
  );
}
