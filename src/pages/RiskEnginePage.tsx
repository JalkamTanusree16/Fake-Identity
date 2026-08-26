import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldAlert, CheckCircle2, ArrowRight, FileText, Info } from 'lucide-react';
import { RiskGauge } from '../components/RiskGauge';

interface WeightItem {
  metric: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  status: 'PASS' | 'FAIL' | 'WARN';
}

export const RiskEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const [exampleMode, setExampleMode] = useState<'genuine' | 'fake'>('genuine');

  const weightsData: Record<'genuine' | 'fake', { score: number; level: 'LOW' | 'CRITICAL'; recommendation: string; explanation: string; breakdown: WeightItem[] }> = {
    genuine: {
      score: 12,
      level: 'LOW',
      recommendation: 'AUTOMATED CLEARANCE PASSED. ROUTE TRAVELER TO IMMIGRATION EXIT GATE.',
      explanation: 'The document exhibits low composite risk. All primary automated checks (MRZ modulo-10 algorithm, ELA compression consistency, biometric photo splicing checks) passed with zero anomalies. Margin layouts and font integrity match standard India Passport template rules.',
      breakdown: [
        { metric: 'MRZ Integrity', weight: 25, rawScore: 0, weightedScore: 0.0, status: 'PASS' },
        { metric: 'ELA Forensics', weight: 25, rawScore: 0, weightedScore: 0.0, status: 'PASS' },
        { metric: 'Field Consistency', weight: 20, rawScore: 25, weightedScore: 5.0, status: 'PASS' },
        { metric: 'Biometric Integrity', weight: 20, rawScore: 20, weightedScore: 4.0, status: 'PASS' },
        { metric: 'Document Structure', weight: 10, rawScore: 30, weightedScore: 3.0, status: 'PASS' }
      ]
    },
    fake: {
      score: 94,
      level: 'CRITICAL',
      recommendation: 'AUTOMATED ENTRY REJECTED. ESCALATE CASE TO SENIOR CASE INVESTIGATION UNIT AND INITIATE IMMIGRATION HOLD.',
      explanation: 'Critical threat risk flagged. Multiple key pipeline checks failed. The MRZ check digit failed weighting modulo calculation, indicating document number alteration. ELA forensics identified high-contrast re-compression boundaries in the date-of-birth zone. Biometric photo edge analysis detected clone stamp splicing signatures along border gradients.',
      breakdown: [
        { metric: 'MRZ Integrity', weight: 25, rawScore: 100, weightedScore: 25.0, status: 'FAIL' },
        { metric: 'ELA Forensics', weight: 25, rawScore: 96, weightedScore: 24.0, status: 'FAIL' },
        { metric: 'Field Consistency', weight: 20, rawScore: 100, weightedScore: 20.0, status: 'FAIL' },
        { metric: 'Biometric Integrity', weight: 20, rawScore: 75, weightedScore: 15.0, status: 'FAIL' },
        { metric: 'Document Structure', weight: 10, rawScore: 100, weightedScore: 10.0, status: 'FAIL' }
      ]
    }
  };

  const activeData = weightsData[exampleMode];

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
        <button 
          onClick={() => navigate('/case-investigation')} 
          className="gov-button-primary"
        >
          Escalate to Case Investigation <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Toggle Examples Selection bar */}
      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-850 flex gap-2 w-fit">
        <button
          onClick={() => setExampleMode('genuine')}
          className={`px-4 py-2 text-xs font-mono font-bold rounded transition-all ${
            exampleMode === 'genuine'
              ? 'bg-[#16A34A] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ✓ Genuine Passport Example (Score 12)
        </button>
        <button
          onClick={() => setExampleMode('fake')}
          className={`px-4 py-2 text-xs font-mono font-bold rounded transition-all ${
            exampleMode === 'fake'
              ? 'bg-[#DC2626] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ✗ Fake Passport Example (Score 94)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circular Risk Gauge & Recommendation */}
        <div className="lg:col-span-5 gov-card flex flex-col items-center justify-between gap-6 text-center">
          <div className="border-b border-gov-border w-full pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Composite Case Threat Score
            </h3>
          </div>

          <RiskGauge 
            score={activeData.score} 
            level={activeData.level} 
            size={200} 
          />

          {/* Official Officer Recommendation Box */}
          <div className="bg-slate-950 p-4 rounded-lg border border-gov-border w-full text-left space-y-2">
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              OFFICER DECISION SUPPORT RECOMMENDATION:
            </div>
            <div className={`text-xs font-bold font-mono ${
              exampleMode === 'fake' ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {activeData.recommendation}
            </div>
          </div>
        </div>

        {/* Right: Factor Breakdown Weights Table & Explanation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weights & Calculation Table */}
          <div className="gov-card space-y-4">
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Zap className="w-4 h-4 text-amber-400" /> Weighted Calculations Table
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {activeData.score} / 100</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[9px]">
                  <tr>
                    <th className="p-3">Analysis Indicator</th>
                    <th className="p-3 text-center">Weight</th>
                    <th className="p-3 text-center">Raw Threat</th>
                    <th className="p-3 text-right">Weighted Risk</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activeData.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                      <td className="p-3 text-slate-200">{item.metric}</td>
                      <td className="p-3 text-center text-slate-400">{item.weight}%</td>
                      <td className="p-3 text-center text-slate-300">{item.rawScore}%</td>
                      <td className="p-3 text-right font-bold text-white">+{item.weightedScore.toFixed(1)}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                          item.status === 'PASS' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-950 text-red-400 border border-red-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-[10px] text-slate-400 font-mono italic">
              Calculation formula: Score = Σ (Raw Threat Score × Metric Weight)
            </div>
          </div>

          {/* Natural Language Reasoning */}
          <div className={`gov-card space-y-3 border-l-4 ${
            exampleMode === 'fake' ? 'border-l-red-500' : 'border-l-emerald-500'
          }`}>
            <div className="border-b border-gov-border pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Explainable AI Natural Language Summary
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              "{activeData.explanation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
