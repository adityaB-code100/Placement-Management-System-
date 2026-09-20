import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, ExternalLink, Building2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews/my');
        setInterviews(res.data || []);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Interview Schedules</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            View upcoming online assessment rounds, technical interviews, and HR discussions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-500">
          Loading interview schedules...
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <CalendarDays className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-base">No Scheduled Interviews</h3>
          <p className="text-xs text-slate-500 mt-1">
            Once you are shortlisted by recruiters, upcoming interview slots will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {item.job_title}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600">
                        {item.company_name}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold border border-indigo-200 uppercase">
                    {item.round}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="text-indigo-900 font-bold">
                      {item.date} at {item.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location Mode:</span>
                    <span className="text-slate-900">{item.location}</span>
                  </div>
                  {item.notes && (
                    <div className="pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-600">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">
                  Status: {item.status}
                </span>

                {item.meeting_link && (
                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    Join Meeting <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
