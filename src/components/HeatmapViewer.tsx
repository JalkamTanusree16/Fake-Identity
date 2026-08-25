import React, { useState } from 'react';
import { HeatmapRegion } from '../types';
import { Eye, ShieldAlert, Layers, ZoomIn } from 'lucide-react';

interface HeatmapViewerProps {
  imageSrc?: string;
  regions: HeatmapRegion[];
  isTampered: boolean;
  tamperingScore: number;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  regions,
  isTampered,
  tamperingScore
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [mode, setMode] = useState<'ORIGINAL' | 'HEATMAP' | 'ELA' | 'EDGES'>('HEATMAP');
  const [activeRegion, setActiveRegion] = useState<HeatmapRegion | null>(regions[0] || null);

  return (
    <div className="gov-card flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-gov-accent" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Forensic Image Analysis Canvas</h3>
        </div>

        <div className="flex items-center gap-2 bg-gov-navyDark p-1 rounded-lg border border-gov-border">
          {(['ORIGINAL', 'HEATMAP', 'ELA', 'EDGES'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                mode === m ? 'bg-gov-blue text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Image & Overlay Canvas Container */}
      <div className="relative w-full h-80 bg-slate-950 rounded-lg overflow-hidden border border-gov-border flex items-center justify-center group">
        {/* Synthetic Passport Canvas Background */}
        <div
          className={`w-full h-full p-6 flex flex-col justify-between transition-all duration-300 ${
            mode === 'ELA' ? 'filter contrast-200 brightness-50 invert' :
            mode === 'EDGES' ? 'filter grayscale contrast-200 blur-[0.5px]' : ''
          }`}
          style={{
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            backgroundColor: '#090d16'
          }}
        >
          {/* Passport Header */}
          <div className="flex justify-between items-start border-b border-slate-700/60 pb-3">
            <div>
              <div className="text-[10px] font-mono text-slate-400">PASSPORT / PASSEPORT</div>
              <div className="text-sm font-bold font-mono text-slate-200">REPUBLIC OF INDIA • BHARAT GANARAJYA</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-amber-400">TYPE / CODE</div>
              <div className="text-sm font-bold font-mono text-white">P &lt; IND</div>
            </div>
          </div>

          {/* Body Photo & Text */}
          <div className="grid grid-cols-12 gap-4 my-auto">
            {/* Photo Box */}
            <div className="col-span-4 bg-slate-800 rounded border border-slate-600 p-2 flex flex-col items-center justify-center relative">
              <div className="w-20 h-24 bg-slate-700 rounded border border-slate-500 flex items-center justify-center text-slate-400 text-xs font-mono">
                [PHOTO]
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">HOLDER PHOTO</span>
            </div>

            {/* Passport Fields */}
            <div className="col-span-8 space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px]">NAME:</span>
                <div className="font-bold text-white">MALHOTRA / VIKRAM</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px]">PASSPORT NO:</span>
                  <div className="font-bold text-white">Z8810293</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">DATE OF BIRTH:</span>
                  <div className={`font-bold ${isTampered ? 'text-red-400 bg-red-950/60 px-1 rounded border border-red-500/40 inline-block' : 'text-white'}`}>
                    12/04/1988
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px]">NATIONALITY:</span>
                  <div className="font-bold text-white">INDIAN</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">EXPIRY DATE:</span>
                  <div className="font-bold text-white">20/05/2030</div>
                </div>
              </div>
            </div>
          </div>

          {/* MRZ Zone */}
          <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] tracking-widest text-slate-300 leading-tight">
            <div>P&lt;INDMALHOTRA&lt;&lt;VIKRAM&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
            <div>Z8810293&lt;8IND8804128M3005204&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
          </div>
        </div>

        {/* AI Heatmap Overlay Boxes */}
        {(mode === 'HEATMAP' || showHeatmap) && regions.map((region, idx) => (
          <div
            key={idx}
            onClick={() => setActiveRegion(region)}
            className="absolute border-2 border-red-500 bg-red-500/20 rounded cursor-pointer animate-pulse transition-all hover:bg-red-500/40"
            style={{
              left: `${(region.x / 600) * 100}%`,
              top: `${(region.y / 400) * 100}%`,
              width: `${(region.width / 600) * 100}%`,
              height: `${(region.height / 400) * 100}%`
            }}
          >
            <span className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow">
              {region.label} ({region.confidence}%)
            </span>
          </div>
        ))}
      </div>

      {/* Selected Region Forensic Details */}
      {activeRegion && (
        <div className="bg-gov-navyDark p-3 rounded-lg border border-red-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-red-300 font-mono">
              TAMPERING EVIDENCE DETECTED: {activeRegion.label}
            </div>
            <div className="text-slate-300">
              Analysis Method: <span className="font-mono text-amber-300">{activeRegion.method}</span> • Confidence: <span className="font-mono text-red-400 font-bold">{activeRegion.confidence}%</span>
            </div>
            <div className="text-slate-400">
              High noise frequency variance and compression block discontinuity detected around bounding coordinates ({activeRegion.x}, {activeRegion.y}).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
