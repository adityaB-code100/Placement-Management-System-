import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{subtitle}</span>
          </p>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
