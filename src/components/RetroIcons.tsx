import React from 'react';
import type { AppId } from '../utils/retroLogic';

export function NotepadIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="12" height="14" fill="#000" />
      <rect x="3" y="2" width="10" height="12" fill="#fff" />
      <rect x="3" y="2" width="10" height="2" fill="#008080" />
      <rect x="4" y="1" width="1" height="2" fill="#808080" />
      <rect x="7" y="1" width="1" height="2" fill="#808080" />
      <rect x="10" y="1" width="1" height="2" fill="#808080" />
      <rect x="4" y="6" width="8" height="1" fill="#000" />
      <rect x="4" y="8" width="8" height="1" fill="#000" />
      <rect x="4" y="10" width="5" height="1" fill="#000" />
    </svg>
  );
}

export function CalculatorIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="12" height="14" fill="#000" />
      <rect x="3" y="2" width="10" height="12" fill="#808080" />
      <rect x="4" y="3" width="8" height="3" fill="#a8d8a8" />
      <rect x="4" y="7" width="2" height="2" fill="#c0c0c0" />
      <rect x="7" y="7" width="2" height="2" fill="#c0c0c0" />
      <rect x="10" y="7" width="2" height="2" fill="#ff8080" />
      <rect x="4" y="10" width="2" height="2" fill="#c0c0c0" />
      <rect x="7" y="10" width="2" height="2" fill="#c0c0c0" />
      <rect x="10" y="10" width="2" height="2" fill="#80bfff" />
    </svg>
  );
}

export function ThemesIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="2" width="14" height="10" fill="#000" />
      <rect x="2" y="3" width="12" height="8" fill="#c0c0c0" />
      <rect x="3" y="4" width="10" height="6" fill="#008080" />
      <rect x="5" y="5" width="3" height="3" fill="#ff0080" />
      <rect x="7" y="6" width="4" height="3" fill="#ffff00" />
      <rect x="6" y="12" width="4" height="2" fill="#808080" />
      <rect x="4" y="14" width="8" height="1" fill="#000" />
    </svg>
  );
}

export function StartFlagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" fill="#ff3300" />
      <rect x="8" y="2" width="5" height="5" fill="#00cc33" />
      <rect x="2" y="8" width="5" height="5" fill="#0066ff" />
      <rect x="8" y="8" width="5" height="5" fill="#ffcc00" />
    </svg>
  );
}

export function AboutMeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" fill="#000" />
      <rect x="2" y="2" width="12" height="12" fill="#c0c0c0" />
      <rect x="2" y="2" width="12" height="2" fill="#000080" />
      <rect x="6" y="5" width="4" height="4" fill="#ffcc99" />
      <rect x="6" y="5" width="4" height="1" fill="#4a2e00" />
      <rect x="4" y="10" width="8" height="3" fill="#008080" />
      <rect x="7" y="10" width="2" height="2" fill="#ffff00" />
    </svg>
  );
}

export function SourceCodeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="2" width="14" height="12" fill="#000" />
      <rect x="2" y="3" width="12" height="10" fill="#101820" />
      <rect x="2" y="3" width="12" height="2" fill="#008080" />
      <rect x="4" y="7" width="1" height="1" fill="#00ff41" />
      <rect x="5" y="8" width="1" height="1" fill="#00ff41" />
      <rect x="4" y="9" width="1" height="1" fill="#00ff41" />
      <rect x="7" y="9" width="4" height="1" fill="#ffff00" />
      <rect x="4" y="11" width="7" height="1" fill="#80bfff" />
    </svg>
  );
}

export function SpeakerIcon({ muted = false, size = 16 }: { muted?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="6" width="3" height="4" fill="#404040" />
      <rect x="5" y="5" width="2" height="6" fill="#808080" />
      <rect x="7" y="3" width="2" height="10" fill="#000" />
      {muted ? (
        <>
          <rect x="11" y="5" width="1" height="1" fill="#ff0000" />
          <rect x="12" y="6" width="1" height="1" fill="#ff0000" />
          <rect x="13" y="7" width="1" height="1" fill="#ff0000" />
          <rect x="14" y="8" width="1" height="1" fill="#ff0000" />
          <rect x="14" y="5" width="1" height="1" fill="#ff0000" />
          <rect x="13" y="6" width="1" height="1" fill="#ff0000" />
          <rect x="12" y="7" width="1" height="1" fill="#ff0000" />
          <rect x="11" y="8" width="1" height="1" fill="#ff0000" />
        </>
      ) : (
        <>
          <rect x="11" y="6" width="1" height="4" fill="#008080" />
          <rect x="13" y="4" width="1" height="8" fill="#008080" />
        </>
      )}
    </svg>
  );
}

export function AppIcon({ appId, size = 32 }: { appId: AppId; size?: number }) {
  switch (appId) {
    case 'notepad':
      return <NotepadIcon size={size} />;
    case 'calculator':
      return <CalculatorIcon size={size} />;
    case 'themes':
      return <ThemesIcon size={size} />;
    case 'about':
      return <AboutMeIcon size={size} />;
    case 'source':
      return <SourceCodeIcon size={size} />;
  }
}
