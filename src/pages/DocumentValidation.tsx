import React, { useEffect, useState } from 'react';
import { CheckSquare, ShieldCheck, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ValidationCheck } from '../types';

export const DocumentValidation: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [checks, setChecks] = useState<ValidationCheck[]>([]);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setChecks(res.validation || []);
    }).catch(() => {
      setChecks([
        { check_name: "ICAO MRZ Checksum Validation", status: "FAIL", detail: "MRZ line 2 check digit '8' does not match extracted passport number checksum '4'", code: "VAL-MRZ-01" },
        { check_name: "Logical DOB Validation", status: "WARN", detail: "Extracted DOB (1988-04-12) shows digit noise artifact around year field", code: "VAL-DOB-02" },
        { check_name: "Passport Expiry Date", status: "PASS", detail: "Document valid until 2030-05-20 (78 months remaining)", code: "VAL-EXP-03" },
        { check_name: "Visa Stay Duration Constraint", status: "PASS", detail: "Visa validity matches requested transit period", code: "VAL-VISA-04" },
        { check_name: "Gender Consistency", status: "PASS", detail: "Gender code 'M' matches visual document photo", code: "VAL-GND-05" }
      ]);
    });
  }, [activeCaseId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Automated Document Validation Engine
          </h2>
          <p className="text-xs text-slate-400">Rule-based compliance checks for ICAO Doc 9303, logical date formats, and visa stay constraints</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={checks.some(c => c.status === 'FAIL') ? 'FAIL' : 'PASS'} />
        </div>
      </div>

      {/* Validation Rule Cards Grid */}
      <div className="space-y-3">
        {checks.map((chk, idx) => (
          <div
            key={idx}
            className={`gov-card border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              chk.status === 'FAIL' ? 'border-l-red-500 bg-red-950/20' :
              chk.status === 'WARN' ? 'border-l-amber-500 bg-amber-950/20' :
              'border-l-emerald-500'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">[{chk.code}]</span>
                <h3 className="text-sm font-bold text-white">{chk.check_name}</h3>
              </div>
              <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {chk.detail}
              </p>
            </div>

            <div className="shrink-0">
              <StatusBadge status={chk.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
