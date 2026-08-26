import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Search, FileText, CheckSquare, Eye, Users,
  Network, Zap, FileSpreadsheet, ShieldAlert, Database, BarChart3,
  Flame, Settings, Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles?: string[];
}

export const SidebarNav: React.FC = () => {
  const { user, login } = useAuth();
  const currentRole = user?.role || 'screening';

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { path: '/screening', label: 'Screening Workspace', icon: Search, badge: 'Pipeline' },
    { path: '/ocr', label: 'OCR Intelligence', icon: FileText },
    { path: '/validation', label: 'Validation Engine', icon: CheckSquare },
    { path: '/forensics', label: 'Forensics Lab', icon: Eye },
    { path: '/face-verification', label: 'Face Verification', icon: Users },
    { path: '/cross-document', label: 'Cross-Doc Matrix', icon: FileSpreadsheet },
    { path: '/identity-graph', label: 'Identity Graph', icon: Network, badge: 'USP' },
    { path: '/risk-engine', label: 'Explainable Risk', icon: Zap },
    { path: '/case-investigation', label: 'Case Investigation', icon: Scale, roles: ['senior', 'senior_officer', 'admin', 'administrator'] },
    { path: '/senior-review', label: 'Senior Officer Review', icon: ShieldAlert, badge: 'Escalated', roles: ['senior', 'senior_officer', 'admin', 'administrator'] },
    { path: '/audit-ledger', label: 'Blockchain Audit', icon: Database, roles: ['senior', 'senior_officer', 'admin', 'administrator'] },
    { path: '/reports', label: 'Incident Reports', icon: FileText },
    { path: '/analytics', label: 'System Analytics', icon: BarChart3, roles: ['admin', 'administrator'] },
    { path: '/attack-simulator', label: 'Attack Simulator', icon: Flame, badge: 'Judge', roles: ['admin', 'administrator'] },
    { path: '/settings', label: 'System Settings', icon: Settings, roles: ['admin', 'administrator'] },
  ];

  const handleRoleSwitch = (username: string, role: string) => {
    login(username, '12345', role as any);
  };

  return (
    <aside className="w-64 bg-gov-navy border-r border-gov-border flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 border-b border-gov-border/60">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Operation Navigation
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.roles) {
            const isAllowed = item.roles.some(r => currentRole.includes(r) || r.includes(currentRole));
            if (!isAllowed) return null;
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gov-blue text-white shadow border-l-4 border-gov-accent'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                  item.badge === 'USP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  item.badge === 'Judge' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Switcher Demo Control */}
      <div className="p-3 border-t border-gov-border/60 bg-gov-navyDark/50 text-xs">
        <div className="text-[10px] text-slate-400 font-semibold mb-1">DEMO ROLE SWITCHER:</div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleRoleSwitch('screening@gmail.com', 'screening')}
            className={`text-[10px] py-1 px-1 text-center rounded font-mono border ${
              currentRole === 'screening' || currentRole === 'screening_officer'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Screening
          </button>
          <button
            onClick={() => handleRoleSwitch('senior@gmail.com', 'senior')}
            className={`text-[10px] py-1 px-1 text-center rounded font-mono border ${
              currentRole === 'senior' || currentRole === 'senior_officer'
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Senior
          </button>
          <button
            onClick={() => handleRoleSwitch('admin@gmail.com', 'admin')}
            className={`text-[10px] py-1 px-1 text-center rounded font-mono border ${
              currentRole === 'admin' || currentRole === 'administrator'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </aside>
  );
};
