import React, { useEffect, useState } from 'react';
import { Users, ShieldAlert, CheckCircle2, Camera, UserCheck } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';

export const FaceVerification: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [faceData, setFaceData] = useState<any>(null);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setFaceData(res.face || {});
    }).catch(() => {
      setFaceData({
        match_score: 52.4,
        is_matched: false,
        liveness_score: 98.2,
        pose_quality: 94.5,
        illumination_quality: 92.0,
        landmark_count: 68,
        explanation: "Facial similarity score (52.4%) is below acceptable operational clearance threshold (75%)."
      });
    });
  }, [activeCaseId]);

  const score = faceData?.match_score ?? 52.4;
  const isMatch = score >= 75.0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Facial Biometrics & Liveness Verification Studio
          </h2>
          <p className="text-xs text-slate-400">Document photo crop vs live checkpoint camera feed geometry & landmark alignment</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-2 ${
          isMatch ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-red-950 text-red-400 border-red-500/40'
        }`}>
          {isMatch ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>Facial Similarity: {score}% ({isMatch ? 'MATCHED' : 'MISMATCH ALERT'})</span>
        </div>
      </div>

      {/* Split Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Photo Crop */}
        <div className="gov-card flex flex-col items-center gap-4 text-center">
          <div className="border-b border-gov-border w-full pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              1. Extracted Document Passport Photo
            </h3>
          </div>

          <div className="w-36 h-44 bg-slate-950 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-center relative p-2">
            <div className="w-24 h-28 bg-slate-800 rounded border border-slate-600 flex items-center justify-center text-slate-400 font-mono text-xs">
              [DOC FACE]
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">Cropped at 300 DPI</span>
          </div>
        </div>

        {/* Live Checkpoint Capture Simulation */}
        <div className="gov-card flex flex-col items-center gap-4 text-center">
          <div className="border-b border-gov-border w-full pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" /> 2. Live Checkpoint Camera Feed (ICP Petrapole)
            </h3>
          </div>

          <div className="w-36 h-44 bg-slate-950 rounded-lg border-2 border-blue-500/60 flex flex-col items-center justify-center relative p-2 shadow-lg">
            <div className="w-24 h-28 bg-slate-800 rounded border border-blue-400 flex items-center justify-center text-slate-400 font-mono text-xs relative overflow-hidden">
              {/* 68-Point Landmark Mesh Simulation Overlay */}
              <div className="absolute inset-0 bg-blue-500/10 border border-blue-400/40 rounded flex items-center justify-center">
                <span className="text-[9px] font-mono text-blue-300 font-bold">68 MESH POINTS</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 mt-2">Liveness: 98.2% (Real Person)</span>
          </div>
        </div>
      </div>

      {/* Biometrics Score Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="gov-card">
          <div className="text-slate-400 text-[10px]">FACIAL GEOMETRY MATCH</div>
          <div className={`text-xl font-extrabold mt-1 ${isMatch ? 'text-emerald-400' : 'text-red-400'}`}>
            {score}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Threshold: 75.0%</div>
        </div>

        <div className="gov-card">
          <div className="text-slate-400 text-[10px]">3D LIVENESS SCORE</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {faceData?.liveness_score || 98.2}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Anti-Spoof Passed</div>
        </div>

        <div className="gov-card">
          <div className="text-slate-400 text-[10px]">FACIAL POSE QUALITY</div>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {faceData?.pose_quality || 94.5}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Frontal Align</div>
        </div>

        <div className="gov-card">
          <div className="text-slate-400 text-[10px]">ILLUMINATION SCORE</div>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {faceData?.illumination_quality || 92.0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Balanced Exposure</div>
        </div>
      </div>
    </div>
  );
};
