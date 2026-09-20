import React, { useState, useEffect } from 'react';
import { FileCheck2, Clock, Building2, CheckCircle2, History, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { ApplicationStepper } from '../../components/common/ApplicationStepper';
import { formatDate, getStatusColor } from '../../utils/formatters';

export const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Applications Tracker</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track your recruitment stages live across all applied campus placement drives.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-500">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <FileCheck2 className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-base">No Applications Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't submitted any job applications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-200 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {app.job_title}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600">
                      {app.company_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                    title="View Timeline History"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Recruitment Pipeline Stepper */}
              <ApplicationStepper currentStatus={app.status} />

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2">
                <span>Applied on: {formatDate(app.created_at)}</span>
                <span>Last status update: {formatDate(app.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Timeline Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Application Audit Trail
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedApp.job_title} • {selectedApp.company_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {(selectedApp.status_history || []).map((h, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase">
                      Stage: {h.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(h.updated_at)}
                    </span>
                  </div>
                  {h.notes && (
                    <p className="text-slate-600 text-[11px]">Notes: {h.notes}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
