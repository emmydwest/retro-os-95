# 🖥️ RetroOS 95 — Nostalgic 90s Web Desktop & Portfolio

An authentic **Windows 95-inspired Web Operating System** built as an interactive developer portfolio. Features crisp pixel edges, 3D beveled borders (`.bevel-raised` & `.bevel-inset`), a full z-index Window Manager, persistent local apps, CRT scanline emulation, and a procedural Web Audio API sound synthesizer.

🔗 **Repository:** [github.com/emmydwest/retro-os-95](https://github.com/emmydwest/retro-os-95)

---

## ✨ Features

- **🪟 Window Manager (`wm.js` / `RetroWindow`)**:
  - Drag windows smoothly by their top title bar with automatic viewport boundary clamping.
  - Click any window to bring it to the front (`z-index` stacking) and highlight its active Navy Blue gradient title bar.
  - Minimize (`_`), Maximize/Restore (`□`), and Close (`X`) windows, or toggle them directly from the bottom Taskbar and **Start Menu**.
- **📝 Notepad (`Notepad.exe`)**:
  - Full-height sunken `.bevel-inset` text editor with `localStorage` auto-save (`retro_notes`) so notes persist across page refreshes.
  - One-click **Download .txt** export using `Blob` and `URL.createObjectURL()`.
  - Built-in template loader (`README.TXT`, `TODO_1995.TXT`, `DESIGN_SPEC.TXT`) and live status bar tracking lines, words, characters, and bytes.
- **🧮 Pocket LCD Calculator (`Calc.exe`)**:
  - Classic green-tinted LCD readout (`#a8d8a8`) with expression history and full keyboard support.
  - 3D beveled button grid supporting standard arithmetic (`+`, `-`, `*`, `/`), decimals, sign toggle (`±`), `DEL`, `CE`, and `C`.
- **🎨 Display Properties & CRT Switcher (`Themes.cpl`)**:
  - Live interactive mini CRT monitor preview.
  - Instant switching between **Classic 95 Teal**, **Vaporwave 90s**, **Matrix Cyber**, or a custom **Desktop Wallpaper Color Picker** (`<input type="color">`).
  - Toggleable **CRT Scanline Overlay** (`pointer-events: none`) and theme persistence in `localStorage`.
- **🔊 Procedural Web Audio Synthesizer**:
  - Zero external audio files required—uses the browser's native **Web Audio API** to synthesize tactile square-wave button clicks, window open/close blips, error buzzers, and a warm polyphonic 90s startup chord.
- **👨‍💻 Developer Portfolio & Source Exporter (`About_Me.exe` & `Source_Code.exe`)**:
  - Retro System Properties dialog showcasing developer bio, featured projects, tech stack, and system specs.
  - Built-in `Source_Code.exe` inspector to copy or download standalone `index.html`, `css/style.css`, `js/wm.js`, `js/apps.js`, and `js/clock.js` files.

---

## 🚀 Quick Start

### Run Locally (Vite + React + TypeScript)

```bash
git clone https://github.com/emmydwest/retro-os-95.git
cd retro-os-95
npm install
npm run dev
```

### Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial release of RetroOS 95 Web Desktop"
git branch -M main
git remote add origin https://github.com/emmydwest/retro-os-95.git
git push -u origin main
```
