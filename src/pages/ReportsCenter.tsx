import React from 'react';
import { FileText, Download, ShieldCheck, Printer } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';

export const ReportsCenter: React.FC = () => {
  const { activeCaseId } = useScreening();

  const handleDownloadPdf = () => {
    window.open(`/api/reports/${activeCaseId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            MHA Official Incident Screening Reports Center
          </h2>
          <p className="text-xs text-slate-400">Standardized Ministry of Home Affairs PDF report export with QR audit verification</p>
        </div>
        <button onClick={handleDownloadPdf} className="gov-button-primary">
          <Download className="w-4 h-4" /> Download Case PDF Report
        </button>
      </div>

      {/* PDF Report Preview Card */}
      <div className="gov-card p-8 border-2 border-slate-700 bg-slate-950 max-w-3xl mx-auto space-y-6 text-xs shadow-2xl">
        {/* Government Header */}
        <div className="text-center border-b-2 border-gov-blue pb-4 space-y-1">
          <div className="text-sm font-extrabold text-white tracking-wide">
            MINISTRY OF HOME AFFAIRS • GOVERNMENT OF INDIA
          </div>
          <div className="text-xs text-slate-400 font-mono">
            SASHASTRA SEEMA BAL (SSB) • BORDER SECURITY SCREENING DIVISION
          </div>
          <div className="text-[10px] text-amber-400 font-mono">
            OFFICIAL BORDER INCIDENT REPORT • CASE FILE: {activeCaseId}
          </div>
        </div>

        {/* Case Info Table */}
        <div className="grid grid-cols-2 gap-4 font-mono text-[11px] bg-slate-900 p-4 rounded border border-slate-800">
          <div>Traveler Name: <span className="text-white font-bold">Vikram Malhotra</span></div>
          <div>Checkpoint Station: <span className="text-slate-200">ICP Petrapole (IN-BD)</span></div>
          <div>Risk Score: <span className="text-red-400 font-bold">86 / 100 (CRITICAL)</span></div>
          <div>Screening Officer: <span className="text-blue-400">Officer Rajesh Mehta (SSB-SO-4091)</span></div>
        </div>

        {/* Evidence Breakdown */}
        <div className="space-y-2">
          <h4 className="font-bold text-white font-mono text-xs border-b border-slate-800 pb-1">
            EXPLAINABLE AI THREAT EVIDENCE & FORENSIC SUMMARY:
          </h4>
          <p className="text-slate-300 leading-relaxed font-sans">
            Critical risk detected due to digital DOB text manipulation in passport document Z8810293, facial similarity score (52.4%) failing minimum clearance threshold, and identity graph intelligence flagging duplicate passport record X992104.
          </p>
        </div>

        {/* Audit Hash Seal */}
        <div className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between items-center font-mono text-[10px]">
          <div>
            <div className="text-slate-400">SHA-256 Cryptographic Block Hash:</div>
            <div className="text-amber-300 font-bold">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
          </div>
          <div className="text-right text-emerald-400 font-bold">
            MERKLE ROOT VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
};
