import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const GovernmentHeader: React.FC = () => {
  const { user, logout } = useAuth();

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
                DigiVerify
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-Powered Identity & Document Verification • Ministry of Home Affairs
            </p>
          </div>
        </div>

        {/* Right Controls & Officer Badge */}
        <div className="flex items-center gap-4">
          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-gov-border">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {user.badge_number} • <span className="uppercase text-blue-400">{user.role.replace('_', ' ')}</span>
                </div>
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
