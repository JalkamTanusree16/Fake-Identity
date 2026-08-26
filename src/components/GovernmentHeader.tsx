import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const GovernmentHeader: React.FC = () => {
  const { user, logout, selectedCountry } = useAuth();

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'OFFICER':
        return 'bg-blue-500/20 text-[#00D4FF] border border-blue-500/30';
      case 'SENIOR_REVIEWER':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'AUDITOR':
        return 'bg-emerald-500/20 text-[#00FF88] border border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  return (
    <header className="bg-gov-navy border-b border-gov-border sticky top-0 z-40 px-6 py-3 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Emblem & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gov-blue flex items-center justify-center border border-blue-400/30 shadow-inner">
            <Shield className="w-6 h-6 text-[#00D4FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                IdentityShield
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              National Identity Verification System
            </p>
          </div>
        </div>

        {/* Right Controls & Officer Badge */}
        <div className="flex items-center gap-4">
          {/* Country Flag */}
          {selectedCountry && (
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-md text-xs font-mono text-slate-300"
              title={`Jurisdiction: ${selectedCountry.name}`}
            >
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="font-bold text-white">{selectedCountry.name}</span>
            </div>
          )}

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-gov-border">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2 justify-end">
                  <span>ID: {user.badge_number}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${getRoleBadgeClasses(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout System"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
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
