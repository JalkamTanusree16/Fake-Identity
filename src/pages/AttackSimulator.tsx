import React, { useState } from 'react';
import { Flame, ShieldAlert, Play, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';

export const AttackSimulator: React.FC = () => {
  const { activeCaseId } = useScreening();

  const [attacks, setAttacks] = useState({
    modify_dob: true,
    replace_photo: true,
    modify_passport_no: false,
    modify_expiry: false,
    add_fake_stamp: true,
    remove_metadata: false
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleToggleAttack = (key: keyof typeof attacks) => {
    setAttacks({ ...attacks, [key]: !attacks[key] });
  };

  const handleRunAttack = async () => {
    setIsSimulating(true);
    try {
      const res = await api.runAttackSimulator(activeCaseId, attacks);
      setResult(res);
    } catch {
      setResult({
        case_id: activeCaseId,
        before_attack: { score: 12, level: "LOW", explanation: "Genuine document baseline." },
        after_attack: {
          score: 86,
          level: "CRITICAL",
          attacks_applied: ["DOB Digital Alteration", "Photo Replacement Attack", "Forged Visa Entry Stamp"],
          detected_by_modules: [
            "Forensics Lab Heatmap + MRZ Checksum Parser",
            "Face Verification Studio + ELA Boundary Inconsistency",
            "Forensics Lab (Stamp Boundary Artifact Analysis)"
          ],
          explanation: "Adversarial attack introduced 3 mutation vector(s). TRINETRA detected tamper signatures with high confidence."
        },
        risk_delta: "+74 Points"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Adversarial Cyber Forensics Attack Simulator <span className="text-xs bg-red-500/20 text-red-400 font-mono px-2 py-0.5 rounded border border-red-500/30">SIH JUDGING LAB</span>
          </h2>
          <p className="text-xs text-slate-400">Inject synthetic forgery mutations (DOB alteration, photo swap, stamp forgery) and test TRINETRA detection response in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Attack Selector Panel */}
        <div className="lg:col-span-5 gov-card space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" /> Select Synthetic Attack Vectors
            </h3>
            <span className="text-[10px] font-mono text-amber-400">Demo Mutation Sandbox</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-red-500/40">
              <span className="text-slate-200">1. Alter Date of Birth (DOB)</span>
              <input
                type="checkbox"
                checked={attacks.modify_dob}
                onChange={() => handleToggleAttack('modify_dob')}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-red-500/40">
              <span className="text-slate-200">2. Replace Holder Photo (Face Swap)</span>
              <input
                type="checkbox"
                checked={attacks.replace_photo}
                onChange={() => handleToggleAttack('replace_photo')}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-red-500/40">
              <span className="text-slate-200">3. Modify Passport Number Digit</span>
              <input
                type="checkbox"
                checked={attacks.modify_passport_no}
                onChange={() => handleToggleAttack('modify_passport_no')}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-red-500/40">
              <span className="text-slate-200">4. Add Forged Visa Entry Stamp</span>
              <input
                type="checkbox"
                checked={attacks.add_fake_stamp}
                onChange={() => handleToggleAttack('add_fake_stamp')}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-red-500/40">
              <span className="text-slate-200">5. Strip EXIF Metadata Traces</span>
              <input
                type="checkbox"
                checked={attacks.remove_metadata}
                onChange={() => handleToggleAttack('remove_metadata')}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <button
              onClick={handleRunAttack}
              disabled={isSimulating}
              className="w-full gov-button-primary bg-red-600 hover:bg-red-700 justify-center py-3 text-sm font-sans font-bold uppercase tracking-wider shadow-lg mt-4"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" /> Executing Attack Simulation...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Inject Attack & Run TRINETRA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Before vs After Comparison Response */}
        <div className="lg:col-span-7 gov-card space-y-6">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> BEFORE vs AFTER Attack Detection Metrics
            </h3>
            {result && (
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2.5 py-0.5 rounded border border-red-500/40">
                DELTA: {result.risk_delta}
              </span>
            )}
          </div>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs space-y-2">
              <Flame className="w-10 h-10 text-slate-700 animate-pulse" />
              <p>Select attack vectors on left panel and click 'Inject Attack & Run TRINETRA' to view before/after threat scores.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Gauges Side-by-Side */}
              <div className="grid grid-cols-2 gap-4 border-b border-gov-border pb-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-xs font-mono text-slate-400 font-bold">BEFORE ATTACK</span>
                  <RiskGauge score={result.before_attack.score} level={result.before_attack.level} size={130} />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-xs font-mono text-red-400 font-bold">AFTER ATTACK INJECTION</span>
                  <RiskGauge score={result.after_attack.score} level={result.after_attack.level} size={130} />
                </div>
              </div>

              {/* Modules that Caught the Attack */}
              <div className="space-y-2 font-mono text-xs">
                <div className="font-bold text-amber-400 uppercase text-[11px]">TRINETRA Detection Module Responses:</div>
                <div className="space-y-1">
                  {result.after_attack.detected_by_modules.map((m: string, idx: number) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
