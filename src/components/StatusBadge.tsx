import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'PASS' | 'WARN' | 'FAIL' | 'NEW' | 'ANALYZING' | 'REVIEW_REQUIRED' | 'ESCALATED' | 'UNDER_INVESTIGATION' | 'CLEARED' | 'REJECTED' | 'CLOSED' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PASS':
      case 'CLEARED':
        return { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/40', icon: CheckCircle2, label: 'PASS' };
      case 'WARN':
      case 'REVIEW_REQUIRED':
      case 'UNDER_INVESTIGATION':
        return { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/40', icon: AlertTriangle, label: status };
      case 'FAIL':
      case 'REJECTED':
      case 'CRITICAL':
        return { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', icon: XCircle, label: status };
      case 'ESCALATED':
        return { bg: 'bg-purple-950/60', text: 'text-purple-300', border: 'border-purple-500/40', icon: AlertTriangle, label: 'ESCALATED' };
      default:
        return { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/40', icon: Clock, label: status };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border shadow-sm ${style.bg} ${style.text} ${style.border} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{style.label}</span>
    </span>
  );
};
