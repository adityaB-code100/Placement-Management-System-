import React from 'react';

export const LoadingSkeleton = ({ count = 4, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-1/2 h-4 bg-slate-300 rounded" />
            <div className="w-3/4 h-8 bg-slate-300 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 bg-slate-100 rounded-xl w-full border border-slate-200" />
      ))}
    </div>
  );
};
