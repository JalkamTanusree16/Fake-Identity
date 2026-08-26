// DEMO CREDENTIALS
// Admin: admin@idverify.gov / Admin@123
// Officer: officer@idverify.gov / Officer@123
// Reviewer: reviewer@idverify.gov / Reviewer@123
// Auditor: auditor@idverify.gov / Auditor@123

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth, CountryInfo } from '../context/AuthContext';

const COUNTRIES: CountryInfo[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' }
];

export const Login: React.FC = () => {
  const { login, setSelectedCountry } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [country, setCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setSelectedCountry(country);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = await login(email, password, country);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. This attempt has been logged.');
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Log in directly
    login(demoEmail, demoPass, country).then((success) => {
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. This attempt has been logged.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #00D4FF 1px, transparent 1px), linear-gradient(to bottom, #00D4FF 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>

      {/* Top Header */}
      <div className="text-center space-y-3 mt-4 relative z-10">
        <div className="inline-flex items-center gap-3 bg-[#0F172A] px-4 py-2 rounded-full border border-slate-800 shadow-md">
          <Shield className="w-5 h-5 text-[#00D4FF]" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            National Security Infrastructure
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          IdentityShield
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-medium">
          National Identity Verification System
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-lg p-6 shadow-2xl relative z-10 space-y-6">
        
        {step === 1 ? (
          /* STEP 1: Country Selector */
          <div className="space-y-6">
            <div className="text-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Select Jurisdiction Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">Choose your country deployment zone</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Available Jurisdictions:
              </label>
              
              <div className="grid grid-cols-1 gap-2.5">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCountry(c)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                      country.code === c.code
                        ? 'border-[#00D4FF] bg-[#1E293B]/40 text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                        : 'border-slate-800 bg-[#0F172A] text-slate-300 hover:border-slate-700 hover:bg-[#1E293B]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    {country.code === c.code && (
                      <span className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[#00D4FF] hover:bg-[#00b0d4] text-[#0A0F1E] font-extrabold uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2 text-sm"
            >
              Continue to Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 2: Credentials Login */
          <div className="space-y-5">
            {/* Country Flag Banner */}
            <div className="flex items-center justify-between bg-[#1E293B]/40 border border-slate-800 px-3.5 py-2 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span>Portal:</span>
                <span className="text-base leading-none">{country.flag}</span>
                <span className="font-semibold text-white">{country.name}</span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-[#00D4FF] hover:text-[#00b0d4] hover:underline flex items-center gap-1 font-sans text-[11px]"
              >
                <ArrowLeft className="w-3 h-3" /> Change
              </button>
            </div>

            <div className="text-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Official Personnel Login
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Secure identity credentials verification</p>
            </div>

            {/* Warn Banner */}
            <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-lg flex items-start gap-2.5 text-amber-300 text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Authorized Personnel Only</strong> — Unauthorized access is a criminal offense. All activities are monitored and cryptographically logged.
              </span>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500/40 text-red-300 text-xs p-3 rounded-lg font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Official Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@idverify.gov"
                    className="w-full bg-[#1E293B]/30 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] placeholder:text-slate-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Password:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1E293B]/30 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] placeholder:text-slate-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00D4FF] hover:bg-[#00b0d4] text-[#0A0F1E] font-extrabold uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Secure Login'} <Lock className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials Panel for Judges */}
            <div className="border-t border-slate-800 pt-4 mt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2.5">
                Judge Demonstration Panel
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  onClick={() => handleQuickDemo('admin@idverify.gov', 'Admin@123')}
                  className="bg-[#1E293B]/30 hover:bg-[#1E293B]/60 p-2 rounded border border-slate-800 text-left hover:border-purple-500/30 transition-colors"
                >
                  <div className="font-bold text-purple-400 font-mono">ADMIN</div>
                  <div className="text-slate-500 text-[9px] truncate">admin@idverify.gov</div>
                </button>
                <button
                  onClick={() => handleQuickDemo('officer@idverify.gov', 'Officer@123')}
                  className="bg-[#1E293B]/30 hover:bg-[#1E293B]/60 p-2 rounded border border-slate-800 text-left hover:border-blue-500/30 transition-colors"
                >
                  <div className="font-bold text-blue-400 font-mono">OFFICER</div>
                  <div className="text-slate-500 text-[9px] truncate">officer@idverify.gov</div>
                </button>
                <button
                  onClick={() => handleQuickDemo('reviewer@idverify.gov', 'Reviewer@123')}
                  className="bg-[#1E293B]/30 hover:bg-[#1E293B]/60 p-2 rounded border border-slate-800 text-left hover:border-amber-500/30 transition-colors"
                >
                  <div className="font-bold text-amber-400 font-mono">SR_REVIEWER</div>
                  <div className="text-slate-500 text-[9px] truncate">reviewer@idverify.gov</div>
                </button>
                <button
                  onClick={() => handleQuickDemo('auditor@idverify.gov', 'Auditor@123')}
                  className="bg-[#1E293B]/30 hover:bg-[#1E293B]/60 p-2 rounded border border-slate-800 text-left hover:border-green-500/30 transition-colors"
                >
                  <div className="font-bold text-green-400 font-mono">AUDITOR</div>
                  <div className="text-slate-500 text-[9px] truncate">auditor@idverify.gov</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-slate-500 max-w-lg relative z-10 mb-4 font-mono">
        IDENTITYSHIELD SECURE CORE v2.8 • GOVERNMENT CLOUD CLUSTER
      </div>
    </div>
  );
};
