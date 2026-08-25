import React from 'react';
import { AlertCircle } from 'lucide-react';

export const GovernmentDisclaimer: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border-t border-gov-border px-6 py-3 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <p>
          <strong className="text-slate-300">GOVERNMENT DEMONSTRATION DISCLAIMER:</strong> TRINETRA is an AI-assisted decision-support prototype developed for demonstration purposes. It does not connect to real government databases or perform real-world identity/blacklist verification. Final clearance authority remains strictly with authorized border security officers.
        </p>
      </div>
      <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
        SIH 2026 • MHA / SSB Police II Division
      </div>
    </div>
  );
};
