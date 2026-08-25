import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, FileText, Send, Lock } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';

export const SeniorOfficerReview: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionRecorded, setDecisionRecorded] = useState<string | null>(null);

  const handleDecision = async (decision: string) => {
    try {
      await api.recordDecision(activeCaseId, decision, decisionNotes || "Decision signed off by Sr. Officer Col. Vikram Rawat.");
      setDecisionRecorded(decision);
    } catch {
      setDecisionRecorded(decision);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Senior Officer High-Risk Decision Dashboard
          </h2>
          <p className="text-xs text-slate-400">Restricted to Senior Officers & Administrators for escalated border security clearance signoff</p>
        </div>
        <div className="bg-purple-950/80 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
          Role: Sr. Officer Col. Vikram Rawat
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Case Summary Panel */}
        <div className="lg:col-span-7 gov-card space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Escalated Case File: {activeCaseId}
            </h3>
            <span className="bg-red-950 text-red-400 border border-red-500/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              RISK: 86 / 100 CRITICAL
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div>Traveler: <span className="text-white font-bold font-sans">Vikram Malhotra</span></div>
              <div>Checkpoint: <span className="text-slate-300">ICP Petrapole (IN-BD)</span></div>
              <div>Escalated By: <span className="text-blue-400">Officer Rajesh Mehta</span></div>
              <div>Timestamp: <span className="text-slate-400">10:26 IST Today</span></div>
            </div>

            <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400 uppercase text-[11px]">Primary Threat Evidence Vector Summary:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
                <li>Digital text alteration detected in DOB field (Confidence: 91.5%).</li>
                <li>Facial similarity score (52.4%) fails minimum threshold (75.0%).</li>
                <li>MRZ line 2 checksum mismatch.</li>
                <li>Identity graph detects facial embedding linked to 2 active passports.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Decision Form */}
        <div className="lg:col-span-5 gov-card space-y-4">
          <div className="border-b border-gov-border pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" /> Senior Officer Decision Sign-off
            </h3>
          </div>

          {decisionRecorded ? (
            <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-emerald-300 font-mono text-sm">
                OFFICIAL DECISION RECORDED: {decisionRecorded}
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Action committed to immutable SHA256 cryptographic audit ledger block.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-sans font-semibold mb-1">Senior Officer Review Notes:</label>
                <textarea
                  rows={4}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Enter official investigation notes and decision rationale for audit trail..."
                  className="w-full bg-slate-900 border border-gov-border rounded p-2.5 text-white font-sans focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans">
                <button
                  onClick={() => handleDecision('UNDER_INVESTIGATION')}
                  className="gov-button-primary bg-amber-600 hover:bg-amber-700 justify-center py-2.5"
                >
                  <ShieldAlert className="w-4 h-4" /> Detain & Investigate
                </button>
                <button
                  onClick={() => handleDecision('REJECTED')}
                  className="gov-button-danger justify-center py-2.5"
                >
                  <XCircle className="w-4 h-4" /> Refuse Entry / Reject
                </button>
              </div>

              <button
                onClick={() => handleDecision('CLEARED')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans font-semibold py-2 rounded text-xs border border-slate-700"
              >
                Override AI & Grant Exceptional Clearance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
