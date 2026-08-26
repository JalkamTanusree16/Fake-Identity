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
}

const PATH_TO_PERMISSION: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/screening': 'upload',
  '/risk-engine': 'riskEngine',
  '/identity-graph': 'riskEngine',
  '/case-investigation': 'caseInvestigation',
  '/forensics': 'forensics',
  '/face-verification': 'faceVerification',
  '/audit-ledger': 'auditLedger',
  '/reports': 'reports',
  '/analytics': 'analytics'
};

export const SidebarNav: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const currentRole = user?.role || 'OFFICER';

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { path: '/screening', label: 'Screening Workspace', icon: Search, badge: 'Pipeline' },
    { path: '/risk-engine', label: 'Explainable Risk', icon: Zap },
    { path: '/identity-graph', label: 'Identity Graph', icon: Network, badge: 'USP' },
    { path: '/case-investigation', label: 'Case Investigation', icon: Scale },
    { path: '/forensics', label: 'Forensics Lab', icon: Eye },
    { path: '/face-verification', label: 'Face Verification', icon: Users },
    { path: '/audit-ledger', label: 'Blockchain Audit', icon: Database },
    { path: '/reports', label: 'Incident Reports', icon: FileText },
    { path: '/analytics', label: 'System Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-gov-navy border-r border-gov-border flex flex-col shrink-0 min-h-[calc(100vh-61px)] relative z-20">
      <div className="p-4 border-b border-gov-border/60">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Operation Navigation
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const permissionKey = PATH_TO_PERMISSION[item.path];
          const isAllowed = permissionKey ? hasPermission(permissionKey) : true;
          const Icon = item.icon;

          if (!isAllowed) {
            return (
              <div
                key={item.path}
                className="relative group flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-slate-500 bg-slate-900/40 border border-transparent cursor-not-allowed select-none"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-600" />
                  <span className="line-through decoration-slate-700/50">{item.label}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] leading-none text-slate-600" title="Locked">🔒</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3.5 rounded shadow-2xl whitespace-nowrap z-50 pointer-events-none hidden group-hover:block transition-all border-l-4 border-l-red-500">
                  Access Restricted — Your role ({currentRole.replace('_', ' ')}) does not have permission for this module
                </div>
              </div>
            );
          }

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

    </aside>
  );
};
