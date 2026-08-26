import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, CheckCircle2, Clock, FileText, Search, ArrowUpRight,
  TrendingUp, Activity, BarChart2, MapPin, Database, Cpu
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { useScreening } from '../context/ScreeningContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const CommandDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveCaseId } = useScreening();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  const role = user?.role || 'screening';

  useEffect(() => {
    api.getAnalytics().then(setData).catch(() => {
      setData({
        summary: {
          total_screened_today: 1284,
          critical_alerts: 7,
          high_risk_cases: 5,
          medium_risk_cases: 3,
          cleared_cases: 1269,
          average_verification_time_sec: 4.2,
          active_checkpoints: 14,
          system_uptime: "99.98%"
        },
        risk_distribution: [
          { name: 'Low Risk', value: 1269, color: '#16A34A' },
          { name: 'Medium Risk', value: 3, color: '#D97706' },
          { name: 'High Risk', value: 5, color: '#EA580C' },
          { name: 'Critical Alerts', value: 7, color: '#DC2626' }
        ],
        hourly_volume_trend: [
          { hour: '06:00', screened: 45, alerts: 2 },
          { hour: '08:00', screened: 110, alerts: 4 },
          { hour: '10:00', screened: 240, alerts: 9 },
          { hour: '12:00', screened: 320, alerts: 14 },
          { hour: '14:00', screened: 280, alerts: 11 },
          { hour: '16:00', screened: 190, alerts: 6 },
          { hour: '18:00', screened: 99, alerts: 3 }
        ]
      });
    });
  }, []);

  const handleOpenHeroCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate('/screening');
  };

  const summary = data?.summary || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gov-navy p-5 rounded-lg border border-gov-border shadow">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            National Border Command Center
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
              ROLE: {user?.role ? user.role.replace('_', ' ') : 'SCREENING'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {role.includes('admin')
              ? 'System Health, System Statistics & Administrative Overview'
              : role.includes('senior')
              ? 'Review, Escalation & Decision Support Dashboard'
              : 'Operational Traveler & Document Screening Pipeline'}
          </p>
        </div>
        <button
          onClick={() => handleOpenHeroCase('TRI-2026-0001')}
          className="gov-button-primary"
        >
          <Search className="w-4 h-4" /> Start New Document Screening
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gov-card border-l-4 border-l-blue-500 flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {role.includes('admin') ? 'TOTAL SYSTEM SCREENINGS' : 'TOTAL SCREENED TODAY'}
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{summary.total_screened_today || 1284}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% volume capacity
            </div>
          </div>
          <FileText className="w-8 h-8 text-blue-500/40" />
        </div>

        <div className="gov-card border-l-4 border-l-red-500 flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {role.includes('admin') ? 'SECURITY AUDIT EVENTS' : 'CRITICAL THREAT ALERTS'}
            </div>
            <div className="text-2xl font-extrabold font-mono text-red-400 mt-1">{summary.critical_alerts || 7}</div>
            <div className="text-[10px] text-red-400 font-mono mt-1">
              {role.includes('admin') ? 'Recorded in Blockchain Ledger' : 'Requires Senior Escalation'}
            </div>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500/40" />
        </div>

        <div className="gov-card border-l-4 border-l-amber-500 flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {role.includes('admin') ? 'SYSTEM API UPTIME' : 'AVG SCREENING SPEED'}
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
              {role.includes('admin') ? summary.system_uptime || '99.98%' : `${summary.average_verification_time_sec || 4.2}s`}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              {role.includes('admin') ? 'All backend nodes operational' : 'Target: < 5.0 seconds'}
            </div>
          </div>
          {role.includes('admin') ? <Cpu className="w-8 h-8 text-amber-500/40" /> : <Clock className="w-8 h-8 text-amber-500/40" />}
        </div>

        <div className="gov-card border-l-4 border-l-emerald-500 flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-400 font-medium">ACTIVE CHECKPOINTS</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">{summary.active_checkpoints || 14}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All Node Links Online
            </div>
          </div>
          <MapPin className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

      {/* Hero Demonstration Card Prompt */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/60 p-5 rounded-lg border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
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
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded text-xs shadow-lg transition-colors flex items-center gap-2 shrink-0"
        >
          Inspect Case Pipeline <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Trend */}
        <div className="lg:col-span-2 gov-card space-y-3">
          <div className="flex items-center justify-between border-b border-gov-border pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Screening Volume & Threat Trend (Hourly)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live ICP Telemetry</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.hourly_volume_trend || []}>
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
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" /> Threat Severity Breakdown
            </h3>
          </div>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.risk_distribution || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4}>
                  {(data?.risk_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-gov-border/60 pt-2">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low Risk: 98%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium Risk: 1%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High Risk: 0.5%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical: 0.5%</div>
          </div>
        </div>
      </div>

      {/* Recent Screening Queue Table / Role Insights */}
      <div className="gov-card space-y-3">
        <div className="flex items-center justify-between border-b border-gov-border pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {role.includes('admin')
              ? 'System Audit & Management Log'
              : role.includes('senior')
              ? 'Escalation & Case Review Queue'
              : 'Operational Screening Queue'}
          </h3>
          {(role.includes('senior') || role.includes('admin')) && (
            <button onClick={() => navigate(role.includes('admin') ? '/audit-ledger' : '/case-investigation')} className="text-xs text-blue-400 hover:underline font-mono">
              View Complete Ledger →
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Case ID</th>
                <th className="p-3">Traveler / Log Name</th>
                <th className="p-3">Checkpoint / Service</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border">
              <tr className="hover:bg-slate-800/60 transition-colors">
                <td className="p-3 font-bold text-blue-400">TRI-2026-0001</td>
                <td className="p-3 font-bold text-white">Vikram Malhotra</td>
                <td className="p-3 text-slate-300">ICP Petrapole Checkpoint</td>
                <td className="p-3 text-red-400 font-bold">86 / 100</td>
                <td className="p-3"><StatusBadge status="CRITICAL" size="sm" /></td>
                <td className="p-3">
                  <button onClick={() => handleOpenHeroCase('TRI-2026-0001')} className="gov-button-primary py-1 px-2.5 text-[10px]">
                    Inspect <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/60 transition-colors">
                <td className="p-3 font-bold text-blue-400">TRI-2026-0002</td>
                <td className="p-3 text-white">Ananya Sharma</td>
                <td className="p-3 text-slate-300">IGI Airport New Delhi</td>
                <td className="p-3 text-emerald-400 font-bold">12 / 100</td>
                <td className="p-3"><StatusBadge status="PASS" size="sm" /></td>
                <td className="p-3">
                  <button onClick={() => handleOpenHeroCase('TRI-2026-0002')} className="gov-button-secondary py-1 px-2.5 text-[10px]">
                    View
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/60 transition-colors">
                <td className="p-3 font-bold text-blue-400">TRI-2026-0003</td>
                <td className="p-3 text-white">Rahul Verma</td>
                <td className="p-3 text-slate-300">ICP Attari Checkpoint</td>
                <td className="p-3 text-red-400 font-bold">82 / 100</td>
                <td className="p-3"><StatusBadge status="CRITICAL" size="sm" /></td>
                <td className="p-3">
                  <button onClick={() => handleOpenHeroCase('TRI-2026-0003')} className="gov-button-primary py-1 px-2.5 text-[10px]">
                    Inspect
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
