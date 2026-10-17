import React, { useState, useEffect } from 'react';
import {
  THEME_PRESETS,
  closeWindowState,
  focusWindowState,
  getActiveWindowId,
  minimizeWindowState,
  toggleTaskbarWindowState,
  type AppId,
  type ThemeId,
  type WindowState,
} from './utils/retroLogic';
import { soundEngine } from './utils/sound';
import { AppIcon } from './components/RetroIcons';
import { BootScreen } from './components/BootScreen';
import { RetroWindow } from './components/RetroWindow';
import { NotepadApp } from './components/NotepadApp';
import { CalculatorApp } from './components/CalculatorApp';
import { ThemesApp } from './components/ThemesApp';
import { AboutApp } from './components/AboutApp';
import { SourceCodeApp } from './components/SourceCodeApp';
import { Taskbar } from './components/Taskbar';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'notepad',
    title: 'Notepad.exe',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
    x: 118,
    y: 22,
    width: 500,
    height: 390,
  },
  {
    id: 'about',
    title: 'About_Me.exe',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    x: 640,
    y: 16,
    width: 480,
    height: 400,
  },
  {
    id: 'calculator',
    title: 'Calc.exe',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    x: 150,
    y: 430,
    width: 268,
    height: 360,
  },
  {
    id: 'themes',
    title: 'Themes.cpl',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    x: 640,
    y: 424,
    width: 480,
    height: 424,
  },
  {
    id: 'source',
    title: 'Source_Code.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    x: 240,
    y: 64,
    width: 640,
    height: 450,
  },
];

const DESKTOP_ICONS: Array<{ id: AppId; label: string }> = [
  { id: 'notepad', label: 'Notepad.exe' },
  { id: 'calculator', label: 'Calc.exe' },
  { id: 'themes', label: 'Themes.cpl' },
  { id: 'about', label: 'About_Me.exe' },
  { id: 'source', label: 'Source_Code.exe' },
];

export default function App() {
  const [booting, setBooting] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') !== '1';
  });

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>('about');

  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('retro_theme') as ThemeId | null;
      if (saved && (saved === 'classic95' || saved === 'vaporwave' || saved === 'matrix' || saved === 'custom')) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'classic95';
  });

  const [customColor, setCustomColor] = useState<string>(() => {
    try {
      return localStorage.getItem('retro_custom_bg') || '#2d5a7b';
    } catch {
      return '#2d5a7b';
    }
  });

  const [crtEnabled, setCrtEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('retro_crt');
      return saved ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEngine.enabled);

  // Sync theme attributes & CSS variables to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'vaporwave') {
      root.setAttribute('data-theme', 'vaporwave');
      root.style.removeProperty('--desktop-bg');
    } else if (theme === 'matrix') {
      root.setAttribute('data-theme', 'matrix');
      root.style.removeProperty('--desktop-bg');
    } else if (theme === 'custom') {
      root.removeAttribute('data-theme');
      root.style.setProperty('--desktop-bg', customColor);
    } else {
      root.removeAttribute('data-theme');
      root.style.setProperty('--desktop-bg', THEME_PRESETS.classic95.desktopBg);
    }
    try {
      localStorage.setItem('retro_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme, customColor]);

  const handleSelectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
  };

  const handleChangeCustomColor = (color: string) => {
    setCustomColor(color);
    setTheme('custom');
    try {
      localStorage.setItem('retro_custom_bg', color);
    } catch {
      // Ignore
    }
  };

  const handleToggleCrt = (enabled: boolean) => {
    setCrtEnabled(enabled);
    try {
      localStorage.setItem('retro_crt', String(enabled));
    } catch {
      // Ignore
    }
  };

  const handleToggleSound = (enabled: boolean) => {
    soundEngine.setEnabled(enabled);
    setSoundEnabled(enabled);
    if (enabled) {
      soundEngine.playClick(780);
    }
  };

  const handleFocusWindow = (id: AppId) => {
    setWindows((prev) => focusWindowState(prev, id));
  };

  const handleOpenApp = (id: AppId) => {
    soundEngine.playWindowOpen();
    setWindows((prev) => focusWindowState(prev, id));
  };

  const handleCloseWindow = (id: AppId) => {
    setWindows((prev) => closeWindowState(prev, id));
  };

  const handleMinimizeWindow = (id: AppId) => {
    setWindows((prev) => minimizeWindowState(prev, id));
  };

  const handleToggleMaximizeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const handleMoveWindow = (id: AppId, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  };

  const handleToggleTaskbarTab = (id: AppId) => {
    setWindows((prev) => toggleTaskbarWindowState(prev, id));
  };

  const activeWindowId = getActiveWindowId(windows);

  const desktopBackground =
    theme === 'custom'
      ? customColor
      : THEME_PRESETS[theme]?.desktopBg || THEME_PRESETS.classic95.desktopBg;

  return (
    <div
      id="retro-desktop"
      style={{ background: desktopBackground }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedIcon(null);
        }
      }}
      className="relative w-screen h-screen overflow-hidden select-none"
    >
      {booting && <BootScreen onComplete={() => setBooting(false)} />}

      {/* Optional CRT Scanlines Overlay */}
      {crtEnabled && <div className="crt-scanlines" data-testid="crt-overlay" aria-hidden="true" />}

      {/* Layer 1: Desktop Icons Column */}
      <nav
        id="desktop-icons"
        aria-label="Desktop Shortcuts"
        className="p-2 sm:p-3 flex flex-row sm:flex-col flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible gap-1.5 sm:gap-3.5 w-full sm:w-32 z-0"
      >
        {DESKTOP_ICONS.map((icon) => {
          const isSelected = selectedIcon === icon.id;
          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setSelectedIcon(icon.id);
                handleOpenApp(icon.id);
              }}
              onDoubleClick={() => {
                handleOpenApp(icon.id);
              }}
              className={`desktop-icon-btn flex flex-col items-center gap-1 p-1 w-[72px] sm:w-28 shrink-0 cursor-pointer focus:outline-none ${
                isSelected ? 'selected' : ''
              }`}
            >
              <AppIcon appId={icon.id} size={isMobile ? 24 : 32} />
              <span className="desktop-icon-label px-1 py-0.5 text-[10px] sm:text-xs text-white font-bold leading-tight text-center truncate sm:overflow-visible sm:whitespace-nowrap max-w-full drop-shadow-[1px_1px_0px_rgba(0,0,0,0.95)]">
                {icon.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Layer 2: Floating Windows Container */}
      <main id="windows-container" aria-label="Desktop Windows">
        {windows.map((win) => {
          const isActive = activeWindowId === win.id;
          return (
            <RetroWindow
              key={win.id}
              win={win}
              isActive={isActive}
              isMobile={isMobile}
              onFocus={handleFocusWindow}
              onClose={handleCloseWindow}
              onMinimize={handleMinimizeWindow}
              onToggleMaximize={handleToggleMaximizeWindow}
              onMove={handleMoveWindow}
            >
              {win.id === 'notepad' && <NotepadApp />}
              {win.id === 'calculator' && <CalculatorApp isActive={isActive} />}
              {win.id === 'themes' && (
                <ThemesApp
                  theme={theme}
                  customColor={customColor}
                  crtEnabled={crtEnabled}
                  soundEnabled={soundEnabled}
                  onSelectTheme={handleSelectTheme}
                  onChangeCustomColor={handleChangeCustomColor}
                  onToggleCrt={handleToggleCrt}
                  onToggleSound={handleToggleSound}
                />
              )}
              {win.id === 'about' && <AboutApp onOpenApp={handleOpenApp} />}
              {win.id === 'source' && <SourceCodeApp />}
            </RetroWindow>
          );
        })}
      </main>

      {/* Layer 3: Fixed Bottom Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        soundEnabled={soundEnabled}
        crtEnabled={crtEnabled}
        onToggleTaskbarTab={handleToggleTaskbarTab}
        onOpenApp={handleOpenApp}
        onToggleSound={handleToggleSound}
        onToggleCrt={handleToggleCrt}
        onReboot={() => setBooting(true)}
      />
    </div>
  );
}
