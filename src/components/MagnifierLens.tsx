import React, { useState } from 'react';
import { ZoomIn, Search, Disc } from 'lucide-react';

export const MagnifierLens: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(3);
  const [coords, setCoords] = useState({ x: 240, y: 180 });
  const [rgb, setRgb] = useState({ r: 218, g: 42, b: 42 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });

    // Calculate synthetic pixel color variance
    const r = Math.min(255, Math.max(20, (x * 2) % 255));
    const g = Math.min(255, Math.max(10, (y * 3) % 255));
    const b = Math.min(255, Math.max(30, (x + y) % 255));
    setRgb({ r, g, b });
  };

  return (
    <div className="gov-card flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-gov-border pb-2">
        <div className="flex items-center gap-2">
          <ZoomIn className="w-4 h-4 text-gov-accent" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">3x Forensic Magnifier & Pixel RGB Inspector</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">Zoom:</span>
          {[2, 3, 5].map((z) => (
            <button
              key={z}
              onClick={() => setZoomLevel(z)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded ${zoomLevel === z ? 'bg-gov-blue text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {z}x
            </button>
          ))}
        </div>
      </div>

      <div
        onMouseMove={handleMouseMove}
        className="relative w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-gov-border cursor-crosshair flex items-center justify-center p-4"
        style={{
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }}
      >
        <div className="text-center font-mono text-xs text-slate-400">
          Move cursor over canvas to inspect micro-text noise & pixel interpolation
        </div>

        {/* Reticle Magnifier Circle */}
        <div
          className="absolute w-24 h-24 rounded-full border-2 border-amber-400 shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
        >
          {/* Crosshair lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-amber-400/40"></div>
            <div className="h-full w-[1px] bg-amber-400/40"></div>
          </div>
          <span className="text-[9px] font-mono text-amber-300 font-bold z-10">
            {zoomLevel}x ZOOM
          </span>
        </div>
      </div>

      {/* Real-time Pixel Readout */}
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
          <span className="text-slate-400">Coords:</span>
          <span className="text-amber-400 font-bold">X:{coords.x} Y:{coords.y}</span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
          <span className="text-slate-400">RGB:</span>
          <span className="text-slate-200">({rgb.r}, {rgb.g}, {rgb.b})</span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
          <span className="text-slate-400">Hex:</span>
          <span className="text-emerald-400 font-bold">#{rgb.r.toString(16).padStart(2, '0')}{rgb.g.toString(16).padStart(2, '0')}{rgb.b.toString(16).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
