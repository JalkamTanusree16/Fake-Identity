import React from 'react';
import { Scale, Clock, CheckCircle2, ShieldAlert, FileText, ArrowUpRight } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';

export const CaseInvestigation: React.FC = () => {
  const { activeCaseId } = useScreening();

  const timelineEvents = [
    { time: "10:21 IST", actor: "System Intake", action: "Case TRI-2026-0001 Created", detail: "Passport Z8810293 uploaded at ICP Petrapole Station", status: "PASS" },
    { time: "10:22 IST", actor: "OCR Engine", action: "OCR & MRZ Extraction Completed", detail: "Extracted traveler name 'Vikram Malhotra'. MRZ checksum warning generated.", status: "WARN" },
    { time: "10:23 IST", actor: "Forensics Engine", action: "Digital Forensics Heatmap Alert", detail: "DOB text field alteration (91.5% conf) & photo boundary anomaly detected", status: "FAIL" },
    { time: "10:24 IST", actor: "Biometrics Engine", action: "Facial Similarity Assessment", detail: "Passport photo vs Live Camera similarity 52.4% (Threshold: 75%)", status: "FAIL" },
    { time: "10:24 IST", actor: "Graph Intelligence", action: "Identity Graph Multi-Passport Alert", detail: "Facial Embedding #8841 linked to duplicate passport X992104", status: "FAIL" },
    { time: "10:25 IST", actor: "Risk Engine", action: "Risk Score 86 / 100 CRITICAL Generated", detail: "Automated decision support recommendation: Priority Manual Investigation", status: "FAIL" },
    { time: "10:26 IST", actor: "Officer Rajesh Mehta", action: "Case Escalated to Senior Officer", detail: "Forwarded to Sr. Officer Col. Vikram Rawat with forensic evidence package", status: "ESCALATED" }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Case Investigation & Audit Timeline
          </h2>
          <p className="text-xs text-slate-400">Step-by-step chronological audit trail for Case ID: <span className="font-mono text-blue-400 font-bold">{activeCaseId}</span></p>
        </div>
      </div>

      <div className="gov-card space-y-6">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Chronological Event Logs
          </h3>
        </div>

        <div className="relative border-l-2 border-slate-700 ml-4 pl-6 space-y-6 font-mono text-xs">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative group">
              <span className={`absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border-2 ${
                evt.status === 'FAIL' ? 'bg-red-500 border-red-300' :
                evt.status === 'WARN' ? 'bg-amber-500 border-amber-300' :
                evt.status === 'ESCALATED' ? 'bg-purple-500 border-purple-300' :
                'bg-emerald-500 border-emerald-300'
              }`}></span>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-white text-xs font-sans">{evt.action}</span>
                  <span className="text-slate-400 text-[10px]">{evt.time}</span>
                </div>
                <div className="text-slate-300 text-[11px] font-sans">
                  {evt.detail}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Actor: <span className="text-blue-400 font-bold">{evt.actor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
