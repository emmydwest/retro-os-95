import React, { useState, useEffect } from 'react';
import { computeNoteStats } from '../utils/retroLogic';
import { soundEngine } from '../utils/sound';

const DEFAULT_NOTE = `=====================================================
   WELCOME TO RETRO-OS 95 — INTERACTIVE PORTFOLIO
=====================================================

Hi there! Welcome to my 1995-inspired Web Desktop.

WHAT YOU CAN DO HERE:
1. Drag any window by its top Navy title bar.
2. Click any window to bring it to the front (z-index).
3. Minimize [_], Maximize [+], or Close [X] windows.
4. Type here in Notepad — your notes auto-save to
   localStorage so they stay here even after refresh!
5. Open Calc.exe for arithmetic & decimal calculations.
6. Open Themes.cpl to switch between Classic 95 Teal,
   Vaporwave 90s, Matrix Cyber, or toggle CRT Scanlines.
7. Open About_Me.exe & Source_Code.exe to explore my
   developer bio, projects, and grab the source code!

---
Feel free to edit this note or download it as a .txt file.`;

const TEMPLATES: Record<string, { label: string; content: string }> = {
  welcome: {
    label: 'README.TXT',
    content: DEFAULT_NOTE,
  },
  todo: {
    label: 'TODO_1995.TXT',
    content: `[x] Install Windows 95 from 13 Floppy Disks
[x] Configure Sound Blaster 16 IRQ=5 DMA=1
[x] Build zero-dependency Window Manager (wm.js)
[x] Add 3D beveled borders (.bevel-raised & .bevel-inset)
[x] Ship interactive GitHub Portfolio Desktop
[ ] Beat Minesweeper on Expert under 99 seconds`,
  },
  architecture: {
    label: 'DESIGN_SPEC.TXT',
    content: `RETRO-OS 95 DESIGN TOKENS
-------------------------
Desktop Teal:     #008080
Surface Grey:     #c0c0c0
Active Titlebar:  #000080 -> #1084d0
Bevel Highlight:  #ffffff / #dfdfdf
Bevel Shadow:     #808080 / #000000
Primary Fonts:    Pixelify Sans, VT323, Courier New`,
  },
};

export function NotepadApp() {
  const [text, setText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('retro_notes');
      return saved !== null ? saved : DEFAULT_NOTE;
    } catch {
      return DEFAULT_NOTE;
    }
  });
  const [activeFile, setActiveFile] = useState<string>('README.TXT');
  const [statusMsg, setStatusMsg] = useState<string>('Saved to localStorage');
  const [wordWrap, setWordWrap] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('retro_notes', text);
    } catch {
      // Ignore storage errors
    }
  }, [text]);

  const stats = computeNoteStats(text);

  const handleSave = () => {
    soundEngine.playClick(760);
    try {
      localStorage.setItem('retro_notes', text);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStatusMsg(`Saved at ${time}`);
    } catch {
      setStatusMsg('Storage unavailable');
    }
  };

  const handleClear = () => {
    soundEngine.playClick(420);
    setText('');
    setActiveFile('UNTITLED.TXT');
    setStatusMsg('Buffer cleared');
  };

  const handleDownload = () => {
    soundEngine.playClick(840);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.toLowerCase();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg(`Downloaded ${activeFile}`);
  };

  const handleLoadTemplate = (key: string) => {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    soundEngine.playClick(680);
    setText(tpl.content);
    setActiveFile(tpl.label);
    setStatusMsg(`Loaded ${tpl.label}`);
  };

  return (
    <div className="flex flex-col h-full gap-1.5 select-none">
      {/* Top Menu & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 pb-1 border-b border-[#808080]">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={handleSave}
            className="bevel-button px-2.5 py-1 text-xs font-bold whitespace-nowrap shrink-0"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bevel-button px-2.5 py-1 text-xs whitespace-nowrap shrink-0"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="bevel-button px-2.5 py-1 text-xs whitespace-nowrap shrink-0"
          >
            Download .txt
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setWordWrap((w) => !w);
            }}
            aria-pressed={wordWrap}
            className={`bevel-button px-2 py-1 text-xs whitespace-nowrap shrink-0 ${
              wordWrap ? 'is-pressed font-bold' : ''
            }`}
          >
            Wrap: {wordWrap ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] opacity-80 pr-0.5">Load:</span>
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLoadTemplate(key)}
              className={`bevel-button px-2 py-0.5 text-[11px] whitespace-nowrap shrink-0 ${
                activeFile === tpl.label ? 'is-pressed font-bold' : ''
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sunken Textarea */}
      <div className="flex-1 min-h-0 flex flex-col">
        <label htmlFor="retro-notepad-textarea" className="sr-only">
          Notepad Text Editor
        </label>
        <textarea
          id="retro-notepad-textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setStatusMsg('Auto-saved');
          }}
          wrap={wordWrap ? 'soft' : 'off'}
          spellCheck={false}
          placeholder="Type your retro notes here..."
          className="bevel-inset w-full h-full flex-1 p-2.5 font-mono-retro text-sm leading-relaxed resize-none focus:outline-none select-text"
        />
      </div>

      {/* Sunken Status Bar */}
      <div className="grid grid-cols-12 gap-1 text-[11px] tabular-nums pt-0.5">
        <div className="col-span-5 bevel-status px-2 py-0.5 truncate" title={statusMsg}>
          {activeFile} · {statusMsg}
        </div>
        <div className="col-span-7 bevel-status px-2 py-0.5 flex items-center justify-end gap-2 truncate">
          <span>Ln {stats.lines}</span>
          <span aria-hidden="true">·</span>
          <span>{stats.words} words</span>
          <span aria-hidden="true">·</span>
          <span>{stats.chars} chars</span>
          <span aria-hidden="true">·</span>
          <span>{stats.bytes} B</span>
        </div>
      </div>
    </div>
  );
}
