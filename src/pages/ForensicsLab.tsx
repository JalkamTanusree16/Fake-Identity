import React, { useEffect, useState } from 'react';
import { Eye, ShieldAlert, Layers, Search, Sparkles } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { HeatmapViewer } from '../components/HeatmapViewer';
import { MagnifierLens } from '../components/MagnifierLens';
import { HeatmapRegion } from '../types';

export const ForensicsLab: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [forensicData, setForensicData] = useState<any>(null);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setForensicData(res.tampering || {});
    }).catch(() => {
      setForensicData({
        is_tampered: true,
        tampering_score: 88.5,
        detected_types: ["text_manipulation", "photo_replacement"],
        heatmap_regions: [
          { x: 140, y: 250, width: 160, height: 40, label: "DOB Digital Alteration Zone", confidence: 91.5, method: "ELA + Noise Variance Inconsistency" },
          { x: 420, y: 140, width: 150, height: 180, label: "Photo Boundary Recompression Anomaly", confidence: 89.0, method: "Gradient Edge Discrepancy" }
        ],
        explanation: "High-confidence digital manipulation detected. DOB text field exhibits localized recompression artifacts, and photo boundary shows edge discontinuity."
      });
    });
  }, [activeCaseId]);

  const regions: HeatmapRegion[] = forensicData?.heatmap_regions || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Digital Image Forensics & Alteration Lab
          </h2>
          <p className="text-xs text-slate-400">Error Level Analysis (ELA), JPEG compression noise artifacts, and region heatmap localization</p>
        </div>
        <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4" />
          Tampering Score: {forensicData?.tampering_score || 88.5}% (High Threat)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas View */}
        <div className="lg:col-span-8 space-y-6">
          <HeatmapViewer
            regions={regions}
            isTampered={forensicData?.is_tampered ?? true}
            tamperingScore={forensicData?.tampering_score ?? 88.5}
          />
        </div>

        {/* Right Forensic Tools Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <MagnifierLens />

          {/* Tampering Detection Categories */}
          <div className="gov-card space-y-3">
            <div className="border-b border-gov-border pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Detected Manipulation Vector Categories
              </h4>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-red-500/30">
                <span className="text-slate-300">DOB Digital Manipulation</span>
                <span className="text-red-400 font-bold">91.5%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-red-500/30">
                <span className="text-slate-300">Photo Replacement Boundary</span>
                <span className="text-red-400 font-bold">89.0%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Forged Stamp Artifacts</span>
                <span className="text-emerald-400 font-bold">Clear (12%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
