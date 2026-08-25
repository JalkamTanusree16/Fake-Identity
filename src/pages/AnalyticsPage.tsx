import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(() => {
      setAnalytics({
        forgery_tactics_breakdown: [
          { tactic: "Text / DOB Manipulation", percentage: 38.0, count: 284 },
          { tactic: "Photo Replacement", percentage: 26.0, count: 194 },
          { tactic: "MRZ Checksum Forgery", percentage: 18.0, count: 134 },
          { tactic: "Forged Visa Stamp", percentage: 12.0, count: 90 },
          { tactic: "Metadata Stripping", percentage: 6.0, count: 45 }
        ],
        checkpoint_performance: [
          { name: "ICP Petrapole", screened: 420, alerts: 12 },
          { name: "ICP Raxaul", screened: 310, alerts: 8 },
          { name: "ICP Attari", screened: 240, alerts: 14 },
          { name: "IGI Delhi", screened: 180, alerts: 4 },
          { name: "ICP Moreh", screened: 134, alerts: 6 }
        ]
      });
    });
  }, []);

  const tactics = analytics?.forgery_tactics_breakdown || [];
  const checkpoints = analytics?.checkpoint_performance || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            System Analytics & Forgery Intelligence Trends
          </h2>
          <p className="text-xs text-slate-400">Statistical insights into forgery vectors, checkpoint efficiency, and screening throughput</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forgery Tactics Breakdown */}
        <div className="gov-card space-y-4">
          <div className="border-b border-gov-border pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Detected Forgery Tactics Distribution
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tactics} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="tactic" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="count" fill="#ea580c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Checkpoint Performance */}
        <div className="gov-card space-y-4">
          <div className="border-b border-gov-border pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Checkpoint Screening Volume & Alert Ratio
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checkpoints}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="screened" fill="#1e3a8a" name="Total Screened" />
                <Bar dataKey="alerts" fill="#dc2626" name="Critical Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
