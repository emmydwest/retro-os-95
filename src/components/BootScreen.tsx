import React, { useEffect, useState } from 'react';
import { soundEngine } from '../utils/sound';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [memoryKb, setMemoryKb] = useState(16384);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const memTimer = setInterval(() => {
      setMemoryKb((prev) => {
        if (prev >= 65536) {
          clearInterval(memTimer);
          return 65536;
        }
        return prev + 8192;
      });
    }, 140);

    const step1 = setTimeout(() => setStep(1), 500);
    const step2 = setTimeout(() => setStep(2), 1050);
    const finish = setTimeout(() => {
      soundEngine.playBootChime();
      onComplete();
    }, 1850);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        soundEngine.playBootChime();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearInterval(memTimer);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finish);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black text-[#c0c0c0] font-vt p-6 sm:p-10 flex flex-col justify-between select-none"
      role="dialog"
      aria-label="RetroOS BIOS Boot Screen"
    >
      <div className="max-w-3xl space-y-3 text-lg sm:text-xl leading-snug">
        <div className="flex items-start justify-between border-b border-[#404040] pb-3">
          <div>
            <p className="text-white font-bold tracking-wider">
              RETRO-BIOS (C) 1995 PORTFOLIO SYSTEMS INC.
            </p>
            <p className="text-[#808080] text-base">
              ROM PCI/ISA BIOS (2A59CF59) — Evaluation Workstation v4.50PG
            </p>
          </div>
          <div className="border-2 border-[#00aa00] px-2 py-0.5 text-[#00ff41] text-sm font-bold">
            ENERGY STAR 95
          </div>
        </div>

        <div className="pt-2 space-y-1">
          <p>MAIN PROCESSOR : INTEL PENTIUM(R) 133 MHz</p>
          <p className="tabular-nums">
            MEMORY TEST : <span className="text-white font-bold">{memoryKb}K OK</span>
          </p>
        </div>

        {step >= 1 && (
          <div className="pt-3 space-y-1 text-[#a8d8a8]">
            <p>Detecting Primary Master ... [RETRO-HDD 1.2GB QUANTUM FIREBALL]</p>
            <p>Detecting Primary Slave  ... [CD-ROM 4X CREATIVE SOUND BLASTER 16]</p>
            <p>Initializing VESA Local Bus SVGA Display (65,536 Colors) ... OK</p>
          </div>
        )}

        {step >= 2 && (
          <div className="pt-4 space-y-1 text-white">
            <p>Starting RetroOS 95 Portfolio Environment...</p>
            <p className="text-[#ffff00]">C:\&gt; WIN95.EXE /PORTFOLIO /GUI</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#404040] pt-3 text-base">
        <span>Press &lt;ESC&gt; or &lt;ENTER&gt; to skip memory check</span>
        <button
          type="button"
          onClick={() => {
            soundEngine.playBootChime();
            onComplete();
          }}
          className="px-3 py-1 bg-[#c0c0c0] text-black font-pixel text-xs font-bold cursor-pointer hover:bg-white"
        >
          Skip Boot Now
        </button>
      </div>
    </div>
  );
}
