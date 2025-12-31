import React from 'react';
import { BoxIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: BoxIcon;
  color: string;
  trend?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend
}: StatCardProps) {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-brutal">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 border-3 border-black shadow-brutal-sm" 
          style={{ backgroundColor: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="font-bold text-xs bg-secondary text-white px-3 py-1 border-2 border-black shadow-brutal-sm uppercase tracking-wide">
            {trend}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-neutral-800 font-bold uppercase tracking-wide text-sm">
        {label}
      </div>
    </div>
  );
}