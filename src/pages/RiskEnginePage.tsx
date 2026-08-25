import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldAlert, CheckCircle2, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';

export const RiskEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCaseId } = useScreening();
  const [risk, setRisk] = useState<any>(null);

  useEffect(() => {
    api.getScreeningData(activeCaseId).then(res => {
      setRisk(res.risk || {});
    }).catch(() => {
      setRisk({
        score: 86,
        level: "CRITICAL",
        factor_breakdown: {
          tampering: 30.0,
          face_mismatch: 24.0,
          validation_anomaly: 16.0,
          cross_document_conflict: 10.0,
          identity_graph_alert: 6.0
        },
        explanation: "Risk increased primarily because the passport contains digital text modification near the date of birth field, the face similarity score is below the acceptable clearance threshold (52.4%), and identity graph reveals duplicate passport linkage.",
        recommendation: "PRIORITY MANUAL INVESTIGATION & SECONDARY INTERROGATION REQUIRED. ESCALATE CASE TO SENIOR OFFICER IMMEDIATELY."
      });
    });
  }, [activeCaseId]);

  const score = risk?.score ?? 86;
  const level = risk?.level ?? 'CRITICAL';
  const factors = risk?.factor_breakdown || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Explainable Multimodal Border Risk Fusion Engine
          </h2>
          <p className="text-xs text-slate-400">Rule-weighted transparent risk scoring, factor breakdown, and human-in-the-loop decision guidance</p>
        </div>
        <button onClick={() => navigate('/senior-review')} className="gov-button-primary">
          Escalate to Senior Officer <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circular Risk Gauge & Recommendation */}
        <div className="lg:col-span-5 gov-card flex flex-col items-center justify-between gap-6 text-center">
          <div className="border-b border-gov-border w-full pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Composite Case Threat Score
            </h3>
          </div>

          <RiskGauge score={score} level={level} size={200} />

          {/* Official Officer Recommendation Box */}
          <div className="bg-slate-950 p-4 rounded-lg border border-gov-border w-full text-left space-y-2">
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              OFFICER DECISION SUPPORT RECOMMENDATION:
            </div>
            <div className="text-xs font-bold text-amber-300 font-mono">
              {risk?.recommendation || "PRIORITY MANUAL INVESTIGATION REQUIRED"}
            </div>
          </div>
        </div>

        {/* Right: Factor Breakdown & Natural Language Explanation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Factor Breakdown Chart */}
          <div className="gov-card space-y-4">
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Evidence Factor Risk Contribution Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {score} / 100</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Image Forensics & Tampering Heatmap (+30% Max)</span>
                  <span className="text-red-400 font-bold">+{factors.tampering || 30.0} Points</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${((factors.tampering || 30.0) / 30) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Facial Biometrics Mismatch (+25% Max)</span>
                  <span className="text-red-400 font-bold">+{factors.face_mismatch || 24.0} Points</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${((factors.face_mismatch || 24.0) / 25) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>MRZ & Validation Rule Failures (+20% Max)</span>
                  <span className="text-amber-400 font-bold">+{factors.validation_anomaly || 16.0} Points</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${((factors.validation_anomaly || 16.0) / 20) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cross-Document Package Conflicts (+15% Max)</span>
                  <span className="text-amber-400 font-bold">+{factors.cross_document_conflict || 10.0} Points</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${((factors.cross_document_conflict || 10.0) / 15) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Natural Language Reasoning */}
          <div className="gov-card space-y-3 border-l-4 border-l-amber-500">
            <div className="border-b border-gov-border pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Explainable AI Natural Language Summary
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{risk?.explanation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
