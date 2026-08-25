import React from 'react';
import { Database, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { AuditBlock as AuditBlockType } from '../types';

interface AuditBlockProps {
  block: AuditBlockType;
}

export const AuditBlockCard: React.FC<AuditBlockProps> = ({ block }) => {
  return (
    <div className="gov-card border-l-4 border-l-blue-500 flex flex-col gap-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-gov-border pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">BLOCK #{block.block_index}</span>
          <span className="bg-blue-950 text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-blue-500/30">
            {block.event_type}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED IMMUTABLE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">CURRENT BLOCK HASH (SHA-256):</span>
          <span className="text-amber-300 font-bold break-all bg-slate-950 p-1.5 rounded block border border-slate-800">
            {block.current_hash}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">PREVIOUS BLOCK HASH:</span>
          <span className="text-slate-300 break-all bg-slate-950 p-1.5 rounded block border border-slate-800">
            {block.previous_hash}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-gov-border/60">
        <div>Officer ID: <span className="text-slate-200">{block.officer_id}</span></div>
        <div>Merkle Root: <span className="text-slate-300 font-bold">{block.merkle_root.slice(0, 16)}...</span></div>
        <div>Timestamp: <span className="text-slate-200">{block.timestamp}</span></div>
      </div>
    </div>
  );
};
