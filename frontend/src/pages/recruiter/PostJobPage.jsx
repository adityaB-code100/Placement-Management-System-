import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Building2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, JOB_TYPES, WORK_MODES } from '../../utils/constants';

export const PostJobPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'Full Time',
    location: 'Bangalore, India',
    work_mode: 'Hybrid',
    ctc: '₹10.0 LPA',
    ctc_number: 10.0,
    application_deadline: '',
    drive_date: '',
    eligible_branches: ['CSE', 'IT'],
    min_cgpa: '7.0',
    max_backlogs: '0',
    graduation_year: '2027',
    min_tenth_percentage: '60',
    min_twelfth_percentage: '60'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/jobs', formData);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900">Post Placement Opportunity</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Create job openings and specify mandatory academic eligibility parameters for student application filtering.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Role Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SDE-1 / DevOps Engineer"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                {JOB_TYPES.map((jt) => (
                  <option key={jt} value={jt}>{jt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CTC Package Display</label>
              <input
                type="text"
                required
                value={formData.ctc}
                onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                placeholder="₹12.5 LPA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CTC Numeric (LPA)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.ctc_number}
                onChange={(e) => setFormData({ ...formData, ctc_number: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                value={formData.work_mode}
                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                {WORK_MODES.map((wm) => (
                  <option key={wm} value={wm}>{wm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mandatory Eligibility Box */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase">
              Mandatory Automatic Eligibility Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-indigo-800 mb-1">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.min_cgpa}
                  onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-indigo-800 mb-1">Max Active Backlogs</label>
                <input
                  type="number"
                  required
                  value={formData.max_backlogs}
                  onChange={(e) => setFormData({ ...formData, max_backlogs: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-indigo-800 mb-1">Graduation Batch</label>
                <input
                  type="text"
                  required
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Drive Date</label>
              <input
                type="date"
                required
                value={formData.drive_date}
                onChange={(e) => setFormData({ ...formData, drive_date: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description & Responsibilities</label>
            <textarea
              rows="4"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2"
            >
              {loading ? 'Publishing...' : 'Publish Drive Opportunity'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
