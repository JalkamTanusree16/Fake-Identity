import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('screening@gmail.com');
  const [password, setPassword] = useState('12345');
  const [otp, setOtp] = useState('884102');
  const [selectedRole, setSelectedRole] = useState<Role>('screening');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password, selectedRole);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials or security token. Password is 12345.');
    }
  };

  const handleQuickDemo = (user: string, role: Role) => {
    setUsername(user);
    setPassword('12345');
    setSelectedRole(role);
    login(user, '12345', role).then(() => navigate('/dashboard'));
  };

  return (
    <div className="min-h-screen bg-gov-navyDark flex flex-col justify-between items-center p-4 sm:p-8">
      {/* Top Government Identity Header */}
      <div className="text-center space-y-2 mt-4">
        <div className="inline-flex items-center gap-3 bg-gov-navy px-4 py-2 rounded-full border border-gov-border shadow">
          <Shield className="w-6 h-6 text-gov-accent" />
          <span className="text-sm font-extrabold text-white tracking-wide">MINISTRY OF HOME AFFAIRS • GOVT. OF INDIA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">DigiVerify</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          AI-Powered Identity & Document Verification — AI Screening Prototype
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md gov-card space-y-6 shadow-2xl border-t-4 border-t-gov-blue">
        <div className="border-b border-gov-border pb-4 text-center">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-gov-accent" /> Secure Border Portal Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">Authorized Sashastra Seema Bal (SSB) Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-300 text-xs p-3 rounded font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 mb-1 font-sans font-semibold">User Role Selection:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full bg-slate-900 border border-gov-border rounded p-2.5 text-white font-sans focus:outline-none focus:border-gov-blue"
            >
              <option value="screening">Screening Officer</option>
              <option value="senior">Senior Officer</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-sans font-semibold">Username / Email:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-gov-border rounded p-2.5 pl-9 text-white font-mono focus:outline-none focus:border-gov-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-sans font-semibold">Password (12345):</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-gov-border rounded p-2.5 pl-9 text-white font-mono focus:outline-none focus:border-gov-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-sans font-semibold">2FA Security OTP (Simulated):</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-slate-900 border border-gov-border rounded p-2.5 text-amber-400 font-mono tracking-widest text-center text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full gov-button-primary justify-center py-3 text-sm font-sans font-bold uppercase tracking-wider"
          >
            Authenticate & Open Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="border-t border-gov-border pt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Demo Accounts (Password: 12345):
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <button
              onClick={() => handleQuickDemo('screening@gmail.com', 'screening')}
              className="bg-slate-900 hover:bg-slate-800 p-2 rounded border border-slate-700 text-slate-200 text-center"
            >
              <div className="font-bold text-blue-400">SCREENING</div>
              <div className="text-slate-400 text-[9px]">screening@gmail.com</div>
            </button>
            <button
              onClick={() => handleQuickDemo('senior@gmail.com', 'senior')}
              className="bg-slate-900 hover:bg-slate-800 p-2 rounded border border-slate-700 text-slate-200 text-center"
            >
              <div className="font-bold text-purple-400">SENIOR</div>
              <div className="text-slate-400 text-[9px]">senior@gmail.com</div>
            </button>
            <button
              onClick={() => handleQuickDemo('admin@gmail.com', 'admin')}
              className="bg-slate-900 hover:bg-slate-800 p-2 rounded border border-slate-700 text-slate-200 text-center"
            >
              <div className="font-bold text-amber-400">ADMIN</div>
              <div className="text-slate-400 text-[9px]">admin@gmail.com</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-xs text-slate-500 max-w-lg">
        Ministry of Home Affairs • Sashastra Seema Bal (SSB) • DigiVerify AI Prototype
      </div>
    </div>
  );
};
