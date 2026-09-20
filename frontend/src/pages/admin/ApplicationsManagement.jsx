import React, { useState, useEffect } from 'react';
import { FileCheck2, Search, ExternalLink, Calendar } from 'lucide-react';
import api from '../../services/api';
import { RECRUITMENT_STAGES } from '../../utils/constants';
import { formatDate, getStatusColor } from '../../utils/formatters';

export const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = stageFilter ? `/admin/applications?status=${stageFilter}` : '/admin/applications';
      const res = await api.get(url);
      setApplications(res.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [stageFilter]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        notes: `Stage updated to ${newStatus} by Placement Admin.`
      });
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Applications Recruitment Pipeline</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Global pipeline tracking across all campus placement drives.
          </p>
        </div>

        <div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
          >
            <option value="">All Recruitment Stages</option>
            {RECRUITMENT_STAGES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Candidate Student</th>
                <th className="p-4">Company & Job Title</th>
                <th className="p-4">Department & CGPA</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    Loading recruitment pipeline...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const snapshot = app.student_snapshot || {};
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">
                        <div>{snapshot.full_name || 'Student'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {snapshot.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{app.job_title}</div>
                        <div className="text-[10px] text-indigo-600 font-semibold">
                          {app.company_name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>{snapshot.department || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500 font-bold">
                          CGPA: {snapshot.cgpa || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(app.created_at)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                        >
                          {RECRUITMENT_STAGES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
