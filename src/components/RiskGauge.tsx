import React from 'react';

interface RiskGaugeProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    switch (level) {
      case 'CRITICAL': return '#DC2626'; // Red
      case 'HIGH': return '#EA580C';     // Orange
      case 'MEDIUM': return '#D97706';   // Amber
      case 'LOW': return '#16A34A';      // Green
      default: return '#3B82F6';
    }
  };

  const currentColor = getColor();

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Score Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
          {score}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">/ 100 RISK</span>
        <span
          className="mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow"
          style={{ backgroundColor: `${currentColor}25`, color: currentColor, border: `1px solid ${currentColor}50` }}
        >
          {level}
        </span>
      </div>
    </div>
  );
};
