import React, { useState } from 'react';
import { soundEngine } from '../utils/sound';

const STANDALONE_FILES: Record<string, { filename: string; description: string; code: string }> = {
  'index.html': {
    filename: 'index.html',
    description: 'Desktop layout, inline SVG icons, draggable windows, and bottom taskbar',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RetroOS 95 — Web Desktop Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <!-- Desktop Icons Layer -->
  <main id="desktop">
    <nav id="desktop-icons" aria-label="Desktop Icons">
      <button class="desktop-icon" ondblclick="openWindow('notepad')">
        <span class="icon-label">Notepad.exe</span>
      </button>
      <button class="desktop-icon" ondblclick="openWindow('calculator')">
        <span class="icon-label">Calc.exe</span>
      </button>
      <button class="desktop-icon" ondblclick="openWindow('themes')">
        <span class="icon-label">Themes.cpl</span>
      </button>
    </nav>

    <!-- Floating Windows Container -->
    <div id="windows-container">
      <section id="win-notepad" class="window bevel-raised active" style="left: 110px; top: 40px; width: 460px;">
        <header class="title-bar">
          <span class="title-text">Notepad.exe</span>
          <div class="win-controls">
            <button onclick="minimizeWindow('notepad')">_</button>
            <button onclick="closeWindow('notepad')">X</button>
          </div>
        </header>
        <div class="window-body">
          <div class="toolbar">
            <button class="bevel-raised" id="btn-save">Save</button>
            <button class="bevel-raised" id="btn-clear">Clear</button>
            <button class="bevel-raised" id="btn-download">Download .txt</button>
          </div>
          <textarea id="notepad-area" class="bevel-inset" rows="12"></textarea>
        </div>
      </section>
    </div>
  </main>

  <!-- Fixed Bottom Taskbar -->
  <footer id="taskbar" class="bevel-raised">
    <button id="start-btn" class="bevel-raised">Start</button>
    <div id="active-tabs"></div>
    <div class="system-tray bevel-inset">
      <span id="clock">12:00 PM</span>
    </div>
  </footer>

  <script src="js/wm.js"></script>
  <script src="js/apps.js"></script>
  <script src="js/clock.js"></script>
</body>
</html>`,
  },
  'css/style.css': {
    filename: 'css/style.css',
    description: 'Retro 95 CSS variables, 3D beveled borders (.bevel-raised & .bevel-inset), and themes',
    code: `:root {
  --desktop-bg: #008080;
  --surface-grey: #c0c0c0;
  --titlebar-active: #000080;
  --titlebar-gradient: #1084d0;
  --titlebar-inactive: #808080;
  --text-main: #000000;
  --text-light: #ffffff;
  --bevel-light: #ffffff;
  --bevel-mid-light: #dfdfdf;
  --bevel-shadow: #808080;
  --bevel-dark: #000000;
}

[data-theme="vaporwave"] {
  --desktop-bg: linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #b967ff 100%);
  --surface-grey: #f3e6ff;
  --titlebar-active: #b967ff;
  --titlebar-gradient: #ff71ce;
}

[data-theme="matrix"] {
  --desktop-bg: #050a05;
  --surface-grey: #112211;
  --titlebar-active: #00aa00;
  --titlebar-gradient: #004400;
  --text-main: #00ff41;
}

* {
  box-sizing: border-box;
  border-radius: 0 !important;
  font-smooth: never;
  -webkit-font-smoothing: none;
}

body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--desktop-bg);
  font-family: 'Pixelify Sans', Tahoma, sans-serif;
  color: var(--text-main);
}

.bevel-raised {
  background: var(--surface-grey);
  border-top: 2px solid var(--bevel-light);
  border-left: 2px solid var(--bevel-light);
  border-right: 2px solid var(--bevel-dark);
  border-bottom: 2px solid var(--bevel-dark);
  box-shadow: inset 1px 1px 0px var(--bevel-mid-light),
              inset -1px -1px 0px var(--bevel-shadow);
}

.bevel-inset {
  background: #ffffff;
  border-top: 2px solid var(--bevel-shadow);
  border-left: 2px solid var(--bevel-shadow);
  border-right: 2px solid var(--bevel-light);
  border-bottom: 2px solid var(--bevel-light);
  box-shadow: inset 1px 1px 0px var(--bevel-dark),
              inset -1px -1px 0px var(--bevel-mid-light);
}`,
  },
  'js/wm.js': {
    filename: 'js/wm.js',
    description: 'Window Manager: z-index focus, title-bar dragging, and viewport clamping',
    code: `let highestZ = 10;

function focusWindow(winEl) {
  highestZ++;
  winEl.style.zIndex = highestZ;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  winEl.classList.add('active');
}

document.querySelectorAll('.window').forEach(win => {
  const titleBar = win.querySelector('.title-bar');
  let isDragging = false, offsetX = 0, offsetY = 0;

  win.addEventListener('mousedown', () => focusWindow(win));

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - 100));
    const y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - 60));
    win.style.left = \`\${x}px\`;
    win.style.top = \`\${y}px\`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});`,
  },
  'js/apps.js': {
    filename: 'js/apps.js',
    description: 'Notepad localStorage auto-save, .txt Blob download, Calculator, and Theme Switcher',
    code: `// Notepad Auto-Save & Blob Download
const textarea = document.getElementById('notepad-area');
if (textarea) {
  textarea.value = localStorage.getItem('retro_notes') || 'Welcome to RetroOS 95!';
  textarea.addEventListener('input', () => {
    localStorage.setItem('retro_notes', textarea.value);
  });
}

document.getElementById('btn-download')?.addEventListener('click', () => {
  const blob = new Blob([textarea.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'retro-notes.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Theme Switcher
function setTheme(themeName) {
  if (themeName === 'classic') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeName);
  }
  localStorage.setItem('retro_theme', themeName);
}`,
  },
  'js/clock.js': {
    filename: 'js/clock.js',
    description: 'Live taskbar system tray clock & Start Menu toggle',
    code: `function updateClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;
  clockEl.textContent = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

setInterval(updateClock, 1000);
updateClock();`,
  },
  'README.md': {
    filename: 'README.md',
    description: 'GitHub Repository README with # ✨ Features section for emmydwest/retro-os-95',
    code: `# 🖥️ RetroOS 95 — Nostalgic 90s Web Desktop & Portfolio

An authentic Windows 95-inspired Web Operating System built for GitHub Pages and interactive developer portfolios.

🔗 Repository: https://github.com/emmydwest/retro-os-95#-features

## ✨ Features

- **Window Manager (wm.js)**: Drag windows by their title bar, focus via dynamic z-index, minimize to taskbar, maximize, or close.
- **Persistent Notepad (Notepad.exe)**: Auto-saves notes to localStorage ('retro_notes'), downloads .txt files via Blob, and displays live line/word/char/byte stats.
- **Pocket LCD Calculator (Calc.exe)**: 3D beveled keypad and sunken LCD display with full arithmetic and keyboard support.
- **Display Properties & CRT Switcher (Themes.cpl)**: Switch between Classic 95 Teal, Vaporwave 90s, Matrix Cyber, custom wallpaper color picker, and CRT Scanline overlay.
- **Web Audio Synth Engine**: Zero-dependency browser synthesizer for tactile button clicks and a polyphonic 90s startup chord.

## 🚀 Push to GitHub (emmydwest/retro-os-95)

\`\`\`bash
git init
git add .
git commit -m "feat: build RetroOS 95 web desktop portfolio"
git branch -M main
git remote add origin https://github.com/emmydwest/retro-os-95.git
git push -u origin main
\`\`\``,
  },
};

export function SourceCodeApp() {
  const [selectedFile, setSelectedFile] = useState<string>('index.html');
  const [copyStatus, setCopyStatus] = useState<string>('Ready');

  const active = STANDALONE_FILES[selectedFile];

  const handleCopy = async () => {
    soundEngine.playClick(800);
    try {
      await navigator.clipboard.writeText(active.code);
      setCopyStatus(`Copied ${active.filename}!`);
    } catch {
      setCopyStatus('Selected for copy');
    }
  };

  const handleDownloadFile = () => {
    soundEngine.playClick(860);
    const blob = new Blob([active.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = active.filename.replace('/', '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopyStatus(`Downloaded ${active.filename}`);
  };

  return (
    <div className="flex flex-col h-full gap-1.5 select-none">
      {/* File Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#808080] pb-1">
        <div className="flex flex-wrap items-center gap-1">
          {Object.keys(STANDALONE_FILES).map((fileKey) => (
            <button
              key={fileKey}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setSelectedFile(fileKey);
                setCopyStatus('Ready');
              }}
              className={`bevel-button px-2 py-0.5 text-xs font-mono-retro whitespace-nowrap ${
                selectedFile === fileKey ? 'is-pressed font-bold' : ''
              }`}
            >
              {fileKey}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="bevel-button px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
          >
            Copy Code
          </button>
          <button
            type="button"
            onClick={handleDownloadFile}
            className="bevel-button px-2.5 py-0.5 text-xs whitespace-nowrap"
          >
            Download File
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <pre className="bevel-inset flex-1 min-h-0 p-2.5 font-mono-retro text-xs leading-relaxed overflow-auto select-text m-0">
        <code>{active.code}</code>
      </pre>

      {/* Bottom Status */}
      <div className="flex items-center justify-between gap-2 text-[11px] bevel-status px-2 py-0.5">
        <span className="truncate">{active.description}</span>
        <span className="font-mono-retro font-bold shrink-0">{copyStatus}</span>
      </div>
    </div>
  );
}
