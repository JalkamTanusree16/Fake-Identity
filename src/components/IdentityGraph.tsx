import React, { useState } from 'react';
import { Network, ShieldAlert, User, FileText, CheckCircle2 } from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

interface IdentityGraphProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  suspiciousClusters?: any[];
}

export const IdentityGraph: React.FC<IdentityGraphProps> = ({
  nodes = [],
  edges = [],
  suspiciousClusters = []
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0] || null);

  // Default fallback visualization coordinates if nodes provided
  const nodeCoords: Record<string, { x: number; y: number; color: string; icon: string }> = {
    'P-TRI-2026-0001': { x: 200, y: 150, color: '#3B82F6', icon: '👤' },
    'FACE-8841': { x: 380, y: 100, color: '#EC4899', icon: '📸' },
    'DOC-Z8810293': { x: 200, y: 280, color: '#10B981', icon: '📄' },
    'DOC-X992104': { x: 540, y: 150, color: '#EF4444', icon: '🚨' },
    'VISA-9921': { x: 100, y: 240, color: '#8B5CF6', icon: '✈️' },
    'PERMIT-301': { x: 540, y: 280, color: '#F59E0B', icon: '🎫' }
  };

  return (
    <div className="gov-card flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Identity Intelligence Network Graph</h3>
            <p className="text-[11px] text-slate-400">Graph intelligence engine detecting facial embedding linkage across synthetic passports</p>
          </div>
        </div>

        {suspiciousClusters.length > 0 && (
          <span className="bg-red-950/80 text-red-400 border border-red-500/40 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            MULTI-PASSPORT CLUSTER ALERT
          </span>
        )}
      </div>

      {/* SVG Network Canvas */}
      <div className="relative w-full h-80 bg-slate-950 rounded-lg border border-gov-border overflow-hidden p-4">
        <svg className="w-full h-full">
          {/* Render Edges */}
          <line x1="200" y1="150" x2="380" y2="100" stroke="#334155" strokeWidth="2" />
          <line x1="200" y1="150" x2="200" y2="280" stroke="#334155" strokeWidth="2" />
          <line x1="200" y1="280" x2="100" y2="240" stroke="#334155" strokeWidth="2" />

          {/* Suspicious Edge Alert Lines */}
          <line x1="380" y1="100" x2="540" y2="150" stroke="#EF4444" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
          <line x1="540" y1="150" x2="540" y2="280" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" />

          {/* Render Nodes */}
          {Object.entries(nodeCoords).map(([id, pos]) => (
            <g
              key={id}
              onClick={() => setSelectedNode({ id, label: id, type: 'node', category: 'Graph Node' })}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="24"
                fill={pos.color}
                fillOpacity="0.2"
                stroke={pos.color}
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fontSize="14"
              >
                {pos.icon}
              </text>
              <text
                x={pos.x}
                y={pos.y + 38}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {id}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 p-2 rounded border border-slate-800 text-[10px] font-mono space-y-1">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Primary Person</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Biometric Face #8841</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Current Passport Z8810293</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Suspicious Duplicate X992104</div>
        </div>
      </div>

      {/* Cluster Alert Banner */}
      {suspiciousClusters.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-lg flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-red-300 font-mono uppercase">
              GRAPH THREAT DETECTION: MULTI-IDENTITY FRAUD RING
            </div>
            <div className="text-slate-300">
              Facial Biometric Embedding <span className="font-mono text-amber-300 font-bold">#8841</span> is simultaneously registered to 2 active passport numbers in the intelligence network: <span className="font-mono text-emerald-400">Z8810293</span> and <span className="font-mono text-red-400">X992104</span>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
