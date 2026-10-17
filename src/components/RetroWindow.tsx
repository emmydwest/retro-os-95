import React, { useRef } from 'react';
import { clampWindowPosition, type AppId, type WindowState } from '../utils/retroLogic';
import { AppIcon } from './RetroIcons';
import { soundEngine } from '../utils/sound';

interface RetroWindowProps {
  win: WindowState;
  isActive: boolean;
  isMobile: boolean;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  children: React.ReactNode;
}

export function RetroWindow({
  win,
  isActive,
  isMobile,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  children,
}: RetroWindowProps) {
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // On narrow mobile screens, only render the currently active window so background windows don't clutter
  if (isMobile && !isActive) {
    return null;
  }

  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Do not start dragging if clicking window control buttons
    if ((e.target as HTMLElement).closest('button')) return;
    onFocus(win.id);
    if (win.isMaximized || isMobile) return;

    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragOffset.current) return;
      const rawX = moveEvent.clientX - dragOffset.current.x;
      const rawY = moveEvent.clientY - dragOffset.current.y;
      const clamped = clampWindowPosition(rawX, rawY, window.innerWidth, window.innerHeight - 36);
      onMove(win.id, clamped.x, clamped.y);
    };

    const handleMouseUp = () => {
      dragOffset.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const style: React.CSSProperties = isMobile
    ? {
        left: '6px',
        top: '76px',
        width: 'calc(100vw - 12px)',
        height: 'calc(100vh - 120px)',
        zIndex: win.zIndex,
      }
    : win.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 36px)',
        zIndex: win.zIndex,
      }
    : {
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 48px)',
        zIndex: win.zIndex,
      };

  return (
    <section
      aria-label={win.title}
      onMouseDown={() => {
        if (!isActive) onFocus(win.id);
      }}
      style={style}
      className={`window bevel-raised fixed flex flex-col p-1 ${isActive ? 'active' : ''}`}
    >
      {/* Title Bar (Drag Handle) */}
      <div
        className="title-bar select-none shrink-0"
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => {
          soundEngine.playClick();
          onToggleMaximize(win.id);
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0 pl-0.5">
          <AppIcon appId={win.id} size={16} />
          <span className="font-bold text-xs tracking-wide truncate">{win.title}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label={`Minimize ${win.title}`}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick(500);
              onMinimize(win.id);
            }}
            className="bevel-button w-5 h-5 flex items-center justify-center text-[11px] font-bold leading-none text-black"
          >
            _
          </button>
          <button
            type="button"
            aria-label={`Maximize ${win.title}`}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick(640);
              onToggleMaximize(win.id);
            }}
            className="bevel-button w-5 h-5 flex items-center justify-center text-[11px] font-bold leading-none text-black"
          >
            □
          </button>
          <button
            type="button"
            aria-label={`Close ${win.title}`}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playWindowClose();
              onClose(win.id);
            }}
            className="bevel-button w-5 h-5 flex items-center justify-center text-[11px] font-bold leading-none text-black"
          >
            X
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="window-body flex-1 min-h-0 flex flex-col pt-1.5 px-1 pb-1 overflow-hidden">
        {children}
      </div>
    </section>
  );
}
