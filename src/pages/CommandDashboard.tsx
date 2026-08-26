import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, CheckCircle2, Clock, FileText, Search, ArrowUpRight,
  TrendingUp, Activity, BarChart2, MapPin, Database, Cpu
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useScreening } from '../context/ScreeningContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const CommandDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveCaseId } = useScreening();
  const { user } = useAuth();

  const role = user?.role || 'OFFICER';
  const isSystemAdmin = role === 'ADMIN' || role.toLowerCase().includes('admin');
  const isSeniorReviewer = role === 'SENIOR_REVIEWER' || role.toLowerCase().includes('senior');

  const renderWelcomeCard = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-900/30 p-6 rounded-lg border border-purple-500/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-bold">
                SYSTEM CONTROL UNIT
              </span>
              <span className="text-xs text-slate-400 font-mono">STATUS: ACTIVE</span>
            </div>
            <h3 className="text-lg font-bold text-white">Welcome Back, {user?.full_name || 'Administrator'}</h3>
            <p className="text-sm text-slate-200 font-sans">
              Full System Access — <strong className="text-purple-400 font-semibold font-mono">1,247</strong> documents screened today | <strong className="text-red-400 font-semibold font-mono">23</strong> high-risk flagged | <strong className="text-purple-400 font-semibold font-mono">4</strong> active officers
            </p>
          </div>
        );
      case 'OFFICER':
        return (
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-900/30 p-6 rounded-lg border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase font-bold">
                  BORDER OPERATIONS PANEL
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Welcome Back, {user?.full_name || 'Officer'}</h3>
              <p className="text-sm text-slate-200">
                Pending Cases: <strong className="text-amber-400 font-mono font-bold">8</strong> | Today's Screenings: <strong className="text-blue-400 font-mono font-bold">1,247</strong> | Escalated: <strong className="text-red-400 font-mono font-bold">23</strong>
              </p>
            </div>
            <button
              onClick={() => navigate('/screening')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded text-sm shadow-lg transition-all flex items-center gap-2"
            >
              Start Screening <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        );
      case 'SENIOR_REVIEWER':
        return (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-900/30 p-6 rounded-lg border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold">
                DECISION SUPPORT CENTER
              </span>
              <span className="text-xs text-amber-400 font-semibold font-mono">Awaiting Review: 8</span>
            </div>
            <h3 className="text-lg font-bold text-white">Welcome Back, {user?.full_name || 'Senior Reviewer'}</h3>
            <div className="flex flex-col md:flex-row justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">AWAITING ESCALATED CASE REVIEW:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-950 border border-red-500/30 px-3 py-1 rounded text-xs font-mono text-red-300 flex items-center gap-2">
                    CASE-1023 <span className="bg-red-950 text-red-400 px-1 py-0.2 rounded text-[10px] font-bold">Risk: 92</span>
                  </span>
                  <span className="bg-slate-950 border border-red-500/30 px-3 py-1 rounded text-xs font-mono text-red-300 flex items-center gap-2">
                    CASE-1028 <span className="bg-red-950 text-red-400 px-1 py-0.2 rounded text-[10px] font-bold">Risk: 87</span>
                  </span>
                  <span className="bg-slate-950 border border-amber-500/30 px-3 py-1 rounded text-xs font-mono text-amber-300 flex items-center gap-2">
                    CASE-1031 <span className="bg-amber-950 text-amber-400 px-1 py-0.2 rounded text-[10px] font-bold">Risk: 81</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/case-investigation')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded text-xs shadow-lg transition-colors flex items-center gap-2 self-start md:self-center"
              >
                Review Cases <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'AUDITOR':
        return (
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-900/30 p-6 rounded-lg border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                COMPLIANCE & AUDIT PANEL
              </span>
              <span className="text-xs text-slate-400 font-mono">LEDGER SECURE</span>
            </div>
            <h3 className="text-lg font-bold text-white">Welcome Back, {user?.full_name || 'Compliance Auditor'}</h3>
            <p className="text-sm text-slate-200 font-sans">
              Total Screened Today: <strong className="text-emerald-400 font-mono font-bold">1,247</strong> | High Risk: <strong className="text-red-400 font-mono">23</strong> | Cases Pending: <strong className="text-amber-400 font-mono">8</strong> | Cases Resolved: <strong className="text-emerald-400 font-mono">1,194</strong>
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate('/audit-ledger')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs shadow-lg transition-colors flex items-center gap-2"
              >
                View Audit Ledger
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2 rounded text-xs transition-colors flex items-center gap-2"
              >
                Generate Report
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const mockChartData = {
    risk_distribution: [
      { name: 'Low Risk', value: 1194, color: '#16A34A' },
      { name: 'Medium Risk', value: 30, color: '#D97706' },
      { name: 'High Risk', value: 23, color: '#EA580C' }
    ],
    hourly_volume_trend: [
      { hour: '06:00', screened: 120, alerts: 2 },
      { hour: '08:00', screened: 240, alerts: 4 },
      { hour: '10:00', screened: 450, alerts: 11 },
      { hour: '12:00', screened: 310, alerts: 3 },
      { hour: '14:00', screened: 280, alerts: 1 },
      { hour: '16:00', screened: 190, alerts: 2 },
      { hour: '18:00', screened: 99, alerts: 0 }
    ]
  };

  const handleOpenHeroCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate('/screening');
  };

  return (
    <div className="space-y-6">
      {/* Top Role-Specific Welcome Card */}
      {renderWelcomeCard()}

      {/* 4 HARDCODED KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Documents Screened Today */}
        <div className="gov-card border-l-4 border-l-blue-500 flex justify-between items-start shadow-md">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              Documents Screened Today
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">1,247</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% volume capacity
            </div>
          </div>
          <FileText className="w-8 h-8 text-blue-500/30" />
        </div>

        {/* Card 2: High Risk Flagged */}
        <div className="gov-card border-l-4 border-l-red-500 flex justify-between items-start shadow-md">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              High Risk Flagged
            </div>
            <div className="text-2xl font-extrabold font-mono text-red-400 mt-1">23</div>
            <div className="text-[10px] text-red-400 font-mono">
              Requires Senior Escalation
            </div>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500/30" />
        </div>

        {/* Card 3: Pending Review */}
        <div className="gov-card border-l-4 border-l-amber-500 flex justify-between items-start shadow-md">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              Pending Review
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">8</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Awaiting officer verification
            </div>
          </div>
          <Clock className="w-8 h-8 text-amber-500/30" />
        </div>

        {/* Card 4: Cases Resolved */}
        <div className="gov-card border-l-4 border-l-emerald-500 flex justify-between items-start shadow-md">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              Cases Resolved
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">1,194</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All Node Links Online
            </div>
          </div>
          <MapPin className="w-8 h-8 text-emerald-500/30" />
        </div>
      </div>

      {/* Demo Judging Case Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/60 p-5 rounded-lg border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
            🎯 DEMO JUDGING CASE: TRI-2026-0001
          </div>
          <h3 className="text-base font-bold text-white">Traveler: Vikram Malhotra (Synthetic Adversarial Case)</h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Exhibits DOB alteration, photo replacement, facial similarity flag (52%), MRZ checksum failure, and identity graph multi-passport alert.
          </p>
        </div>
        <button
          onClick={() => handleOpenHeroCase('TRI-2026-0001')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded text-xs shadow-lg transition-colors flex items-center gap-2 shrink-0 font-sans"
        >
          Inspect Case Pipeline <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Trend */}
        <div className="lg:col-span-2 gov-card space-y-3">
          <div className="flex items-center justify-between border-b border-gov-border pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-blue-400" /> Screening Volume & Threat Trend (Hourly)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live ICP Telemetry</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData.hourly_volume_trend}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }} />
                <Line type="monotone" dataKey="screened" stroke="#3b82f6" strokeWidth={2} name="Total Screened" />
                <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} name="High Risk Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div className="gov-card space-y-3">
          <div className="border-b border-gov-border pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <BarChart2 className="w-4 h-4 text-amber-400" /> Threat Severity Breakdown
            </h3>
          </div>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockChartData.risk_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4}>
                  {mockChartData.risk_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono border-t border-gov-border/60 pt-2 text-slate-400">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-600 shrink-0"></span> Low: 98%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-600 shrink-0"></span> Med: 1.5%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-600 shrink-0"></span> High: 0.5%</div>
          </div>
        </div>
      </div>

      {/* Bottom Layout: Case Table (Left) & Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Operational Screening Queue */}
        <div className="lg:col-span-7 gov-card space-y-3">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {isSystemAdmin
                ? 'System Audit & Management Log'
                : isSeniorReviewer
                ? 'Escalation & Case Review Queue'
                : 'Operational Screening Queue'}
            </h3>
            <button onClick={() => navigate('/case-investigation')} className="text-[10px] text-blue-400 hover:underline font-mono">
              View All Cases →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[9px]">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Traveler</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                <tr className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-bold text-blue-400">TRI-2026-0001</td>
                  <td className="p-3 font-bold text-white">Vikram Malhotra</td>
                  <td className="p-3 text-red-400 font-bold">92 / 100</td>
                  <td className="p-3"><StatusBadge status="CRITICAL" size="sm" /></td>
                  <td className="p-3">
                    <button onClick={() => handleOpenHeroCase('TRI-2026-0001')} className="gov-button-primary py-1 px-2.5 text-[9px] font-sans">
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-bold text-blue-400">TRI-2026-0002</td>
                  <td className="p-3 text-white">Ananya Sharma</td>
                  <td className="p-3 text-emerald-400 font-bold">12 / 100</td>
                  <td className="p-3"><StatusBadge status="PASS" size="sm" /></td>
                  <td className="p-3">
                    <button onClick={() => handleOpenHeroCase('TRI-2026-0002')} className="gov-button-secondary py-1 px-2.5 text-[9px] font-sans">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-bold text-blue-400">TRI-2026-0003</td>
                  <td className="p-3 text-white">Rahul Verma</td>
                  <td className="p-3 text-red-400 font-bold">82 / 100</td>
                  <td className="p-3"><StatusBadge status="CRITICAL" size="sm" /></td>
                  <td className="p-3">
                    <button onClick={() => handleOpenHeroCase('TRI-2026-0003')} className="gov-button-primary py-1 px-2.5 text-[9px] font-sans">
                      Inspect
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Hardcoded Recent Activity Log */}
        <div className="lg:col-span-5 gov-card space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Recent Activity Log</h3>
          </div>
          
          <div className="space-y-4 font-mono text-[11px] leading-relaxed">
            <div className="flex items-start gap-2.5 border-l-2 border-l-red-500 pl-3">
              <span className="text-slate-500 shrink-0">10:42 AM</span>
              <div>
                <span className="text-red-400 font-bold">CASE-1031 flagged HIGH RISK</span> <span className="text-slate-500 font-sans text-[10px]">(fake-passport.jpg)</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Officer: Ravi Mehta</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-l-2 border-l-emerald-500 pl-3">
              <span className="text-slate-500 shrink-0">10:38 AM</span>
              <div>
                <span className="text-emerald-400 font-bold">CASE-1030 cleared LOW RISK</span> <span className="text-slate-500 font-sans text-[10px]">(genuine-passport.jpg)</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Officer: Ravi Mehta</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-l-2 border-l-amber-500 pl-3">
              <span className="text-slate-500 shrink-0">10:21 AM</span>
              <div>
                <span className="text-amber-400 font-bold">CASE-1029 escalated MEDIUM RISK</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Officer: Ravi Mehta → Senior Reviewer: Anita Nair</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-l-2 border-l-red-500 pl-3">
              <span className="text-slate-500 shrink-0">09:55 AM</span>
              <div>
                <span className="text-red-400 font-bold">CASE-1028 flagged HIGH RISK</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Officer: Ravi Mehta</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-l-2 border-l-slate-700 pl-3">
              <span className="text-slate-500 shrink-0">09:30 AM</span>
              <div className="text-slate-400 font-bold">
                System initialized. 4 officers active.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
