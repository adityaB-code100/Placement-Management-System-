import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown } from 'lucide-react';

export const EligibilityBadge = ({ eligibility, compact = false }) => {
  const [showModal, setShowModal] = useState(false);

  if (!eligibility) return null;

  const isEligible = eligibility.is_eligible;
  const reasons = eligibility.reasons || [];

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm border ${
            isEligible
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
          }`}
          title="Click to view eligibility breakdown"
        >
          {isEligible ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ELIGIBLE</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>NOT ELIGIBLE</span>
            </>
          )}
          {!isEligible && reasons.length > 0 && (
            <Info className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
          )}
        </button>
      </div>

      {/* Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600" />
                )}
                <h3 className="text-lg font-bold text-slate-900">
                  Eligibility Evaluation
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {isEligible ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800">
                    🎉 Great news! Your academic and backlog criteria satisfy all mandatory company requirements for this position.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-rose-800 mb-2">
                    You do not meet the following mandatory requirement(s):
                  </p>
                  <ul className="space-y-2">
                    {reasons.map((reason, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs bg-rose-50 text-rose-700 p-2.5 rounded-lg border border-rose-200"
                      >
                        <span className="font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
