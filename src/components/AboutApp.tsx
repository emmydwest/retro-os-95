import React, { useState } from 'react';
import { AboutMeIcon } from './RetroIcons';
import { soundEngine } from '../utils/sound';
import type { AppId } from '../utils/retroLogic';

interface AboutAppProps {
  onOpenApp: (id: AppId) => void;
}

const PROJECTS = [
  {
    title: 'RetroOS 95 Web Desktop',
    role: 'Creator & Lead Frontend Architect',
    year: '1995 / 2026',
    stack: 'HTML5 · CSS3 3D Bevels · TypeScript · Web Audio API',
    summary:
      'Zero-dependency nostalgic 90s operating system featuring z-index window management, persistent Notepad, LCD Calculator, and dynamic CRT themes.',
    actionLabel: 'Inspect Source_Code.exe',
    actionApp: 'source' as AppId,
  },
  {
    title: 'PixelSynth Sound Blaster Engine',
    role: 'Audio Systems Engineer',
    year: '2026',
    stack: 'Web Audio API · Polyphonic Oscillators · Zero Assets',
    summary:
      'Procedural browser sound synthesizer generating authentic tactile square-wave clicks, triangle window chimes, and warm polyphonic startup chords.',
    actionLabel: 'Open Display & Audio',
    actionApp: 'themes' as AppId,
  },
  {
    title: 'RetroNotes LocalFS Editor',
    role: 'Systems Programmer',
    year: '2026',
    stack: 'Blob Export · LocalStorage · Live Byte Telemetry',
    summary:
      'Instant client-side plain-text editor with zero-latency character/word/byte counters, template loading, and one-click .txt file generation.',
    actionLabel: 'Launch Notepad.exe',
    actionApp: 'notepad' as AppId,
  },
];

export function AboutApp({ onOpenApp }: AboutAppProps) {
  const [activeTab, setActiveTab] = useState<'bio' | 'projects' | 'specs'>('bio');

  return (
    <div className="flex flex-col h-full gap-2 p-1 select-none">
      {/* Property Sheet Tabs */}
      <div className="flex items-center gap-1 border-b-2 border-[#ffffff]" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bio'}
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('bio');
          }}
          className={`bevel-button px-3 py-1 text-xs whitespace-nowrap ${
            activeTab === 'bio' ? 'is-pressed font-bold' : ''
          }`}
        >
          General / Bio
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'projects'}
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('projects');
          }}
          className={`bevel-button px-3 py-1 text-xs whitespace-nowrap ${
            activeTab === 'projects' ? 'is-pressed font-bold' : ''
          }`}
        >
          Portfolio Projects
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'specs'}
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('specs');
          }}
          className={`bevel-button px-3 py-1 text-xs whitespace-nowrap ${
            activeTab === 'specs' ? 'is-pressed font-bold' : ''
          }`}
        >
          System Specs
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
        {activeTab === 'bio' && (
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5 p-2 bevel-inset">
              <div className="bevel-raised p-1 shrink-0 flex flex-col items-center gap-0.5">
                <AboutMeIcon size={36} />
                <span className="text-[9px] font-mono-retro font-bold">DEV_ID: #1995</span>
              </div>
              <div className="space-y-0.5 select-text">
                <h2 className="text-xs font-bold leading-snug">
                  Alex Mercer — Creative Frontend & Systems Engineer
                </h2>
                <p className="text-[11px] opacity-80">
                  Building tactile, high-craft web interfaces · San Francisco / Remote
                </p>
                <p className="text-[11px] leading-snug pt-0.5">
                  Obsessed with crisp pixel geometry, zero-latency interactions, and web software
                  that feels like a real machine. Live interactive RetroOS 95 architecture demo.
                </p>
              </div>
            </div>

            <fieldset className="border border-[#808080] px-2 py-1 space-y-0.5">
              <legend className="px-1 text-xs font-bold">Core Engineering Stack</legend>
              <div className="text-[11px] space-y-0.5 select-text leading-snug">
                <p>
                  <strong>Languages:</strong> TypeScript · JavaScript (ES2024) · HTML5 · CSS3 · SQL
                </p>
                <p>
                  <strong>Frontend Architecture:</strong> React 19 · Vanilla DOM Window Managers ·
                  Web Audio API · Canvas 2D
                </p>
                <p>
                  <strong>Design Craft:</strong> Classic 90s Human Interface Guidelines · WCAG AA
                  Accessibility · Keyboard UX
                </p>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <a
                  href="https://github.com/emmydwest/retro-os-95#-features"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playClick(780)}
                  className="bevel-button px-2.5 py-1 text-xs font-bold no-underline"
                >
                  GitHub: emmydwest/retro-os-95
                </a>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(760);
                    onOpenApp('source');
                  }}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                >
                  Grab Source Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playBootChime();
                  }}
                  className="bevel-button px-2 py-1 text-xs"
                >
                  95 Chime
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-2">
            {PROJECTS.map((proj) => (
              <div key={proj.title} className="bevel-inset p-2.5 space-y-1.5 select-text">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xs font-bold">{proj.title}</h3>
                  <span className="text-[11px] font-mono-retro opacity-75 shrink-0">
                    {proj.year}
                  </span>
                </div>
                <p className="text-[11px] font-mono-retro opacity-90">{proj.stack}</p>
                <p className="text-xs leading-snug">{proj.summary}</p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(740);
                      onOpenApp(proj.actionApp);
                    }}
                    className="bevel-button px-2.5 py-0.5 text-[11px] font-bold"
                  >
                    {proj.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="bevel-inset p-3 space-y-2 text-xs font-mono-retro select-text">
            <p className="font-bold border-b border-[#808080] pb-1">
              SYSTEM PROPERTIES — RETRO-OS 95 (BUILD 4.00.950)
            </p>
            <div className="grid grid-cols-3 gap-1">
              <span className="opacity-75">Operating System:</span>
              <span className="col-span-2 font-bold">RetroOS 95 Portfolio Edition</span>
              <span className="opacity-75">Processor:</span>
              <span className="col-span-2">Intel Pentium 133MHz w/ MMX Emulation</span>
              <span className="opacity-75">Memory (RAM):</span>
              <span className="col-span-2">64.0 MB EDO SIMM (Zero External Deps)</span>
              <span className="opacity-75">Display Adapter:</span>
              <span className="col-span-2">S3 Trio64V+ 2MB VRAM (3D Bevel Engine)</span>
              <span className="opacity-75">Sound Card:</span>
              <span className="col-span-2">Web Audio API Synthesizer (16-Bit)</span>
              <span className="opacity-75">Storage Driver:</span>
              <span className="col-span-2">window.localStorage Persistent Volume</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
