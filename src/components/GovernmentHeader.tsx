import React from 'react';
import { Shield, ShieldAlert, User, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useScreening } from '../context/ScreeningContext';

export const GovernmentHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeCaseId, isDemoMode, setIsDemoMode } = useScreening();

  return (
    <header className="bg-gov-navy border-b border-gov-border sticky top-0 z-40 px-6 py-3 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Emblem & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gov-blue flex items-center justify-center border border-blue-400/30 shadow-inner">
            <Shield className="w-6 h-6 text-gov-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                TRINETRA <span className="text-xs px-2 py-0.5 rounded bg-gov-accent/20 text-gov-accent font-semibold border border-gov-accent/30">MHA • SSB</span>
              </h1>
              {isDemoMode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase tracking-wider">
                  SIH Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Explainable AI-Powered Border Identity Intelligence Platform • Ministry of Home Affairs
            </p>
          </div>
        </div>

        {/* Center Active Case Status */}
        <div className="hidden lg:flex items-center gap-3 bg-gov-navyDark/80 border border-gov-border px-3 py-1.5 rounded-md text-xs">
          <span className="text-slate-400">Active Screening Case:</span>
          <span className="font-mono font-bold text-blue-400">{activeCaseId}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-400 font-medium">ICP Petrapole (IN-BD)</span>
        </div>

        {/* Right Controls & Officer Badge */}
        <div className="flex items-center gap-4">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 px-2.5 py-1 rounded border border-amber-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isDemoMode ? 'Demo Active' : 'Enable Demo'}
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-gov-border">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{user.badge_number} • <span className="uppercase text-blue-400">{user.role.replace('_', ' ')}</span></div>
              </div>
              <button
                onClick={logout}
                title="Logout System"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
