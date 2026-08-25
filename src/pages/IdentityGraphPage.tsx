import React, { useEffect, useState } from 'react';
import { Network, Filter, ShieldAlert, Layers } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { IdentityGraph } from '../components/IdentityGraph';

export const IdentityGraphPage: React.FC = () => {
  const { activeCaseId } = useScreening();
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    api.getIdentityGraph(activeCaseId).then(setGraphData).catch(() => {
      setGraphData({
        nodes: [],
        edges: [],
        suspicious_clusters: [{ cluster_id: 'CLUS-01', severity: 'CRITICAL' }]
      });
    });
  }, [activeCaseId]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Identity Graph Intelligence Studio
          </h2>
          <p className="text-xs text-slate-400">Network graph intelligence analyzing facial biometric linkage across historical border records</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/80 px-3 py-1.5 rounded-full border border-amber-500/40">
          <Network className="w-4 h-4" />
          <span>Graph Engine: NetworkX Backend</span>
        </div>
      </div>

      <IdentityGraph
        nodes={graphData?.nodes || []}
        edges={graphData?.edges || []}
        suspiciousClusters={graphData?.suspicious_clusters || []}
      />
    </div>
  );
};
