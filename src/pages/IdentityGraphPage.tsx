import React, { useState } from 'react';
import { Network, ShieldAlert, User, FileText, MapPin, Info, ArrowRight } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  type: 'traveler' | 'document' | 'address';
  risk: 'HIGH' | 'MEDIUM' | 'NONE';
  details: string;
  icon: string;
  x: number;
  y: number;
  color: string;
}

export const IdentityGraphPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Graph Nodes
  const nodes: NodeData[] = [
    {
      id: 'A',
      name: 'Traveler A',
      type: 'traveler',
      risk: 'HIGH',
      details: 'Identified as Vikram Malhotra. High similarity match with Interpol watch-list database. Linked to fraudulent Document X.',
      icon: '👤',
      x: 150,
      y: 80,
      color: '#FF4444' // Red
    },
    {
      id: 'B',
      name: 'Traveler B',
      type: 'traveler',
      risk: 'MEDIUM',
      details: 'Identified as Devendra Shah. Flagged for document reuse. Submitted Document X at Delhi Checkpoint.',
      icon: '👤',
      x: 350,
      y: 50,
      color: '#F59E0B' // Amber
    },
    {
      id: 'C',
      name: 'Traveler C',
      type: 'traveler',
      risk: 'HIGH',
      details: 'Identified as Sanjay Sen. Matches multiple address clustering patterns. Linked to address Y.',
      icon: '👤',
      x: 550,
      y: 80,
      color: '#FF4444' // Red
    },
    {
      id: 'X',
      name: 'Document X',
      type: 'document',
      risk: 'NONE',
      details: 'Indian Passport IN-2847301. Shared between Traveler A and Traveler B. Confirmed forgery.',
      icon: '📄',
      x: 250,
      y: 200,
      color: '#64748B' // Gray
    },
    {
      id: 'Y',
      name: 'Address Y',
      type: 'address',
      risk: 'NONE',
      details: '12th Cross, Sector 4, HSR Layout, Bangalore. Registered address for Traveler A and Traveler C.',
      icon: '🏠',
      x: 450,
      y: 200,
      color: '#64748B' // Gray
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Identity Relationship Graph
          </h2>
          <p className="text-xs text-slate-400">
            Visualizes connections between submitted documents, travelers, and flagged cases to detect shared identity fraud networks.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1.5 rounded-full border border-cyan-500/40">
          <Network className="w-4 h-4 animate-pulse" />
          <span>Graph Engine Active</span>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex gap-3.5 items-start">
        <div className="p-2 bg-blue-950 rounded-lg border border-blue-500/30 text-blue-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
            Network Relationship Mapping
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Identity Graph maps relationships between data points across all screened documents. When the same face appears on two different passports, the same address links three different identities, or the same document number is submitted by multiple travelers, the graph engine surfaces these connections automatically. This enables investigators to detect coordinated fraud rings rather than only catching individual fake documents.
          </p>
        </div>
      </div>

      {/* 3 Use Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card p-4 space-y-2 border border-slate-850 hover:border-slate-800 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FF4444]/10 rounded border border-[#FF4444]/20 text-[#FF4444]">
              <User className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Shared Biometric Detection
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Same face detected on documents submitted by 3 different travelers. All 3 cases flagged and linked in the cluster database.
          </p>
        </div>

        <div className="gov-card p-4 space-y-2 border border-slate-850 hover:border-slate-800 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-400/10 rounded border border-amber-400/20 text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Document Number Reuse
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Passport number <span className="font-mono text-amber-300">IN-2847301</span> submitted at Delhi, Mumbai, and Chennai checkpoints within 48 hours. Coordinated fraud flag.
          </p>
        </div>

        <div className="gov-card p-4 space-y-2 border border-slate-850 hover:border-slate-800 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Address Network Clustering
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            17 entry applications listing the exact same residential address. Network graph cluster automatically flagged for field investigation.
          </p>
        </div>
      </div>

      {/* Node Graph Container */}
      <div className="gov-card p-4 space-y-4">
        <div className="border-b border-gov-border pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Active Relationship Bipartite Mapping
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SVG Visualizer */}
          <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-900 relative overflow-hidden h-80 flex flex-col justify-between">
            <div className="absolute top-3 left-3 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              INTERACTIVE CANVAS
            </div>
            
            <svg className="w-full h-full" viewBox="0 0 700 280" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* EDGES: A -> X, B -> X (red - fraud link) */}
              <line x1="150" y1="80" x2="250" y2="200" stroke="#FF4444" strokeWidth="2.5" className="animate-pulse" />
              <line x1="350" y1="50" x2="250" y2="200" stroke="#FF4444" strokeWidth="2.5" />

              {/* EDGES: A -> Y, C -> Y (amber - suspicious link) */}
              <line x1="150" y1="80" x2="450" y2="200" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="550" y1="80" x2="450" y2="200" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,3" />

              {/* NODES RENDERING */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="28"
                        fill="none"
                        stroke="#00D4FF"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill={node.color}
                      fillOpacity="0.15"
                      stroke={node.color}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-200 group-hover:stroke-white"
                      filter={node.risk === 'HIGH' ? 'url(#glow-red)' : ''}
                    />
                    
                    {/* Emoji Icon inside node */}
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      textAnchor="middle"
                      fontSize="13"
                    >
                      {node.icon}
                    </text>

                    {/* Label below node */}
                    <text
                      x={node.x}
                      y={node.y + 34}
                      textAnchor="middle"
                      fill={isSelected ? '#00D4FF' : '#94A3B8'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="transition-colors group-hover:fill-white"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend Overlay at bottom */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-850 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[9px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FF4444] inline-block shrink-0"></span>
                <span>High Risk Traveler</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#F59E0B] inline-block shrink-0"></span>
                <span>Suspicious Traveler</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#64748B] inline-block shrink-0"></span>
                <span>Document/Address</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-[#FF4444] inline-block shrink-0"></span>
                <span>Confirmed Fraud Link</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 border-t-2 border-dashed border-[#F59E0B] inline-block shrink-0"></span>
                <span>Suspicious Connection</span>
              </div>
            </div>
          </div>

          {/* Node details side pane */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400 uppercase">
                      {selectedNode.type} Entity
                    </span>
                    {selectedNode.risk !== 'NONE' && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                        selectedNode.risk === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {selectedNode.risk} RISK
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono mt-1">
                    {selectedNode.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedNode.details}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Network className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                <p className="text-xs text-slate-400">
                  Click any node on the graph canvas to inspect relationship entity parameters.
                </p>
              </div>
            )}

            {selectedNode && (
              <button
                onClick={() => setSelectedNode(null)}
                className="mt-4 w-full py-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-300 text-center border border-slate-800 hover:border-slate-700 rounded transition-all"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Threat cluster summary footer */}
      <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-lg flex items-start gap-3.5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs space-y-1.5 w-full">
          <div className="font-bold text-red-400 font-mono uppercase tracking-wider">
            Graph Cluster Threat Summary
          </div>
          <p className="text-slate-300 font-sans leading-relaxed">
            Graph analysis has identified 2 confirmed fraud links and 1 suspicious connection in the current case cluster. Recommend immediate investigation of Case <span className="font-mono text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded">CASE-1023</span> and <span className="font-mono text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded">CASE-1031</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
