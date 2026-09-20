import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { RECRUITMENT_STAGES } from '../../utils/constants';

export const ApplicationStepper = ({ currentStatus }) => {
  const isRejected = currentStatus === 'Rejected';

  // Active stage index
  const activeIndex = isRejected
    ? RECRUITMENT_STAGES.indexOf('Rejected')
    : RECRUITMENT_STAGES.indexOf(currentStatus);

  const visibleStages = ['Applied', 'Shortlisted', 'Assessment', 'Technical Interview', 'HR Interview', 'Selected'];

  return (
    <div className="w-full py-4">
      {isRejected ? (
        <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
          <X className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Application Status: <strong className="font-bold uppercase">Rejected</strong></span>
        </div>
      ) : (
        <div className="flex items-center justify-between relative w-full overflow-x-auto pb-2">
          {/* Connecting Track */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 -z-0 rounded" />

          {visibleStages.map((stage, idx) => {
            const stageIndex = RECRUITMENT_STAGES.indexOf(stage);
            const isCompleted = activeIndex > stageIndex || currentStatus === 'Selected';
            const isCurrent = currentStatus === stage;

            return (
              <div key={stage} className="flex flex-col items-center relative z-10 min-w-[90px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-200'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 text-center max-w-[85px] leading-tight ${
                    isCurrent
                      ? 'text-indigo-700 font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
