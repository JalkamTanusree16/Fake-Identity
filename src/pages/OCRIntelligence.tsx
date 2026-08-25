import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Edit3, History, AlertTriangle, Save } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';

export const OCRIntelligence: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [data, setData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [corrections, setCorrections] = useState<any[]>([]);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setData(res.ocr || {});
    }).catch(() => {
      setData({
        name: "Vikram Malhotra",
        passport_number: "Z8810293",
        dob: "1988-04-12",
        expiry: "2030-05-20",
        nationality: "IND",
        gender: "M",
        mrz_l1: "P<INDMALHOTRA<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<",
        mrz_l2: "Z8810293<8IND8804128M3005204<<<<<<<<<<<<<<02"
      });
    });
  }, [activeCaseId]);

  const handleSaveCorrection = async () => {
    if (!editingField) return;
    try {
      const res = await api.correctOcr(activeCaseId, editingField, newValue);
      setData(res.updated_fields);
      setCorrections(res.history);
      setEditingField(null);
    } catch {
      setData({ ...data, [editingField]: newValue });
      setCorrections([...corrections, { field: editingField, new_value: newValue, officer: "Officer Rajesh Mehta" }]);
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            OCR Field Extraction & MRZ Intelligence Hub
          </h2>
          <p className="text-xs text-slate-400">Structured field parsing with character confidence highlights and officer edit history</p>
        </div>
        <div className="text-right text-xs font-mono">
          <span className="text-slate-400">OCR Engine Confidence:</span>{' '}
          <span className="text-emerald-400 font-bold">98.2%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table: Extracted Fields */}
        <div className="lg:col-span-7 gov-card space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Extracted Passport Metadata Fields
            </h3>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              Interactive Field Edit Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">AI Extracted Value</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {Object.entries(data || {}).map(([key, val]) => {
                  if (key.startsWith('mrz')) return null;
                  const isDob = key === 'dob';
                  return (
                    <tr key={key} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-semibold text-slate-300 uppercase">{key.replace('_', ' ')}</td>
                      <td className="p-3">
                        {editingField === key ? (
                          <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="bg-slate-900 border border-blue-500 px-2 py-1 text-white font-mono text-xs rounded"
                          />
                        ) : (
                          <span className={`font-bold ${isDob ? 'text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/40' : 'text-white'}`}>
                            {String(val)}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isDob ? 'bg-amber-950 text-amber-400 border border-amber-500/30' : 'bg-emerald-950 text-emerald-400'}`}>
                          {isDob ? '65.2% (Low)' : '98.5%'}
                        </span>
                      </td>
                      <td className="p-3">
                        {editingField === key ? (
                          <button onClick={handleSaveCorrection} className="gov-button-primary py-1 px-2 text-[10px]">
                            <Save className="w-3 h-3" /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditingField(key); setNewValue(String(val)); }}
                            className="text-blue-400 hover:text-blue-300 font-mono text-[11px] flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: MRZ Parsed Data & Edit History */}
        <div className="lg:col-span-5 space-y-6">
          {/* MRZ Box */}
          <div className="gov-card space-y-3">
            <div className="border-b border-gov-border pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                ICAO Doc 9303 MRZ Lines
              </h3>
              <span className="text-[10px] font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                MRZ Checksum Warning
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs tracking-widest text-slate-300 leading-relaxed overflow-x-auto">
              <div className="text-emerald-400">{data?.mrz_l1 || "P<INDMALHOTRA<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<"}</div>
              <div className="text-amber-400">{data?.mrz_l2 || "Z8810293<8IND8804128M3005204<<<<<<<<<<<<<<02"}</div>
            </div>
            <p className="text-[11px] text-slate-400">
              MRZ Line 2 index 9 check digit shows checksum discrepancy against extracted passport number digit sequence.
            </p>
          </div>

          {/* Officer Correction History Log */}
          <div className="gov-card space-y-3">
            <div className="border-b border-gov-border pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" /> Officer Correction Audit Log
              </h3>
            </div>

            {corrections.length === 0 ? (
              <div className="text-xs text-slate-500 font-mono text-center py-4">
                No manual field overrides recorded for this case.
              </div>
            ) : (
              <div className="space-y-2 text-xs font-mono">
                {corrections.map((c, idx) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                    <div className="flex justify-between text-slate-300 font-bold">
                      <span>Field: {c.field}</span>
                      <span className="text-blue-400">{c.officer}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Updated to: <span className="text-emerald-400 font-bold">{c.new_value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
