import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, AlertTriangle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';

export const CrossDocumentIntelligence: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [crossData, setCrossData] = useState<any>(null);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setCrossData(res.cross_doc || {});
    }).catch(() => {
      setCrossData({
        is_consistent: false,
        discrepancies: [
          { field: "Date of Birth", values: { passport: "1988-04-12", visa: "1990-01-01" }, severity: "CRITICAL", explanation: "DOB on passport (1988-04-12) conflicts with Visa record (1990-01-01)" }
        ],
        matrix: [
          { field: "Traveler Name", passport: "Vikram Malhotra", visa: "Vikram Malhotra", id: "Vikram Malhotra", status: "PASS" },
          { field: "Date of Birth", passport: "1988-04-12", visa: "1990-01-01", id: "1988-04-12", status: "CONFLICT" },
          { field: "Nationality", passport: "IND", visa: "IND", id: "IND", status: "PASS" },
          { field: "Passport Number", passport: "Z8810293", visa: "Z8810293", id: "N/A", status: "PASS" }
        ]
      });
    });
  }, [activeCaseId]);

  const matrix = crossData?.matrix || [];
  const discrepancies = crossData?.discrepancies || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Cross-Document Field Consistency Matrix
          </h2>
          <p className="text-xs text-slate-400">Automated cross-examination across Passport, Visa, Transit Permit, and National ID travel packages</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-2 ${
          crossData?.is_consistent ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-red-950 text-red-400 border-red-500/40'
        }`}>
          {crossData?.is_consistent ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{crossData?.is_consistent ? 'PACKAGE CONSISTENT' : 'FIELD CONFLICT DETECTED'}</span>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancies.length > 0 && (
        <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-red-300 font-mono font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Critical Cross-Document Mismatch Discrepancy
          </div>
          {discrepancies.map((d: any, idx: number) => (
            <div key={idx} className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-red-400 font-bold">{d.field}:</span> {d.explanation}
            </div>
          ))}
        </div>
      )}

      {/* Main Consistency Matrix Table */}
      <div className="gov-card space-y-4">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" /> Traveler Package Field Comparison Matrix
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Case ID: {activeCaseId}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Field Name</th>
                <th className="p-3">Passport Value</th>
                <th className="p-3">Visa Record</th>
                <th className="p-3">National ID</th>
                <th className="p-3">Consistency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border">
              {matrix.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-semibold text-slate-300 uppercase">{row.field}</td>
                  <td className="p-3 font-bold text-white">{row.passport}</td>
                  <td className={`p-3 font-bold ${row.status === 'CONFLICT' ? 'text-red-400 bg-red-950/60 rounded px-1.5' : 'text-slate-200'}`}>
                    {row.visa}
                  </td>
                  <td className="p-3 text-slate-400">{row.id}</td>
                  <td className="p-3">
                    {row.status === 'CONFLICT' ? (
                      <span className="bg-red-950 text-red-400 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        CONFLICT
                      </span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        PASS
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
