import React from 'react';
import { Settings, Shield, Cpu, Database, Key } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            System Settings & AI Model Configuration
          </h2>
          <p className="text-xs text-slate-400">Administrator controls for risk score weights, biometrics thresholds, and AI model cards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Weights Configuration */}
        <div className="gov-card space-y-4">
          <div className="border-b border-gov-border pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" /> Multimodal Risk Weight Capacities
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Image Forensics & Tampering Heatmap Weight:</span>
                <span className="text-amber-400 font-bold">30%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="30" className="w-full accent-amber-500" />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Facial Biometrics Similarity Weight:</span>
                <span className="text-amber-400 font-bold">25%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="25" className="w-full accent-amber-500" />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>ICAO MRZ & Validation Checks Weight:</span>
                <span className="text-amber-400 font-bold">20%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="20" className="w-full accent-amber-500" />
            </div>
          </div>
        </div>

        {/* AI Model Card Transparency */}
        <div className="gov-card space-y-4">
          <div className="border-b border-gov-border pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" /> Responsible AI Model Card Transparency
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
              <div className="text-white font-bold">OCR Model: EasyOCR / PyTesseract Engine</div>
              <div className="text-slate-400 text-[11px]">Purpose: Text extraction from ID documents • Fallback: Regex Rule Extractor</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
              <div className="text-white font-bold">Forensics Engine: Error Level Analysis (ELA)</div>
              <div className="text-slate-400 text-[11px]">Purpose: Recompression artifact localization & JPEG noise analysis</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
              <div className="text-white font-bold">Identity Graph Engine: NetworkX</div>
              <div className="text-slate-400 text-[11px]">Purpose: Multi-passport identity cluster relationship analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
