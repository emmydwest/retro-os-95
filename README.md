<div align="center">

  <h1>🖥️ RetroOS 95 — Web Desktop Environment</h1>
  <p><strong>A nostalgic 1990s operating system and interactive portfolio built entirely in the browser.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Web_Audio_API-008080?style=for-the-badge" alt="Web Audio API" />
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-built-in-applications">Applications</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-customization">Customization</a>
  </p>

  <!-- Optional: Take a screenshot of your desktop, drag-and-drop it into GitHub's README editor, and paste the link below -->
  <!-- <img width="1000" alt="RetroOS 95 Desktop Screenshot" src="YOUR_SCREENSHOT_URL_HERE" /> -->

</div>

---

## 📖 Overview

**RetroOS 95** recreates the tactile feel of classic 90s desktop computing directly in the browser with zero external UI libraries. It features authentic 3D beveled borders, pixel-crisp SVG iconography, a multi-window management engine, persistent local storage, and real-time audio synthesis via the native Web Audio API.

---

## ✨ Features

* **🪟 Custom Window Manager:** Drag, focus (`z-index` stacking), minimize to the taskbar, maximize, restore, and close multiple simultaneous windows with mouse or touch support.
* **🎨 Dynamic Theme Engine:** Switch on the fly between **Classic 95 Teal**, **Vaporwave 90s**, and **Matrix Cyber**, complete with custom desktop background patterns (`Pixel Dots`, `Retro Grid`, `Starfield`) and a custom wallpaper color picker.
* **📺 CRT Monitor Simulation:** Toggleable scanline overlay and pixel-aliased typography for an authentic vintage monitor aesthetic.
* **🔊 Zero-Asset Sound Synthesizer:** Uses the browser's native **Web Audio API** to generate tactile mechanical UI clicks, error beeps, and a classic startup chime without loading external `.mp3` or `.wav` files.
* **💾 State Persistence:** Automatically saves notes and user theme preferences in `localStorage`.

---

## 🗂️ Built-In Applications

| Application | File Name | Description |
| :--- | :--- | :--- |
| **Notepad** | `Notepad.exe` | Full-featured plain text editor with live line/word/character counters, `localStorage` auto-save, and `.txt` file export. |
| **Pocket Calculator** | `Calc.exe` | Classic 4-function desktop calculator with an inset LCD display, expression tracking, and full keyboard numpad support. |
| **Display Properties** | `Themes.cpl` | Interactive control panel featuring a live miniature CRT preview monitor to customize themes, wallpapers, and scanline effects. |
| **System Portfolio** | `About_Me.exe` | Multi-tabbed system dialog showcasing developer bio, technical skill meters, and quick-access social/GitHub links. |
| **UI Design System** | `UI_Guide.txt` | Built-in developer reference featuring 1-click copyable pixel-art SVG icons and 3D bevel CSS utilities. |

---

## 🚀 Getting Started

### Run Locally

If you are running the standalone HTML version:
```bash
# 1. Clone the repository
git clone [https://github.com/YOUR-USERNAME/retro-os-95.git](https://github.com/YOUR-USERNAME/retro-os-95.git)

# 2. Navigate into the project directory
cd retro-os-95

# 3. Open index.html directly in your browser (or use Live Server in VS Code)
open index.html
