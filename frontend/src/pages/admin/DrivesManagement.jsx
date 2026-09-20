import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Calendar, MapPin, Trash2, Edit3, Building2, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { DEPARTMENTS, JOB_TYPES, WORK_MODES } from '../../utils/constants';

export const DrivesManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    description: '',
    job_type: 'Full Time',
    location: 'Bangalore, India',
    work_mode: 'Hybrid',
    ctc: '₹8.0 LPA',
    ctc_number: 8.0,
    application_deadline: '',
    drive_date: '',
    eligible_branches: ['CSE', 'IT'],
    min_cgpa: '7.0',
    max_backlogs: '0',
    graduation_year: '2027',
    min_tenth_percentage: '60',
    min_twelfth_percentage: '60',
    status: 'Active'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs?status=all');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (jobToEdit = null) => {
    if (jobToEdit) {
      setEditingJobId(jobToEdit.id);
      setFormData({
        company_name: jobToEdit.company_name || '',
        title: jobToEdit.title || '',
        description: jobToEdit.description || '',
        job_type: jobToEdit.job_type || 'Full Time',
        location: jobToEdit.location || '',
        work_mode: jobToEdit.work_mode || 'Hybrid',
        ctc: jobToEdit.ctc || '',
        ctc_number: jobToEdit.ctc_number || 8.0,
        application_deadline: jobToEdit.application_deadline || '',
        drive_date: jobToEdit.drive_date || '',
        eligible_branches: jobToEdit.eligible_branches || ['CSE', 'IT'],
        min_cgpa: jobToEdit.min_cgpa || '7.0',
        max_backlogs: jobToEdit.max_backlogs || '0',
        graduation_year: jobToEdit.graduation_year || '2027',
        min_tenth_percentage: jobToEdit.min_tenth_percentage || '60',
        min_twelfth_percentage: jobToEdit.min_twelfth_percentage || '60',
        status: jobToEdit.status || 'Active'
      });
    } else {
      setEditingJobId(null);
      setFormData({
        company_name: '',
        title: '',
        description: '',
        job_type: 'Full Time',
        location: 'Bangalore, India',
        work_mode: 'Hybrid',
        ctc: '₹8.0 LPA',
        ctc_number: 8.0,
        application_deadline: '',
        drive_date: '',
        eligible_branches: ['CSE', 'IT'],
        min_cgpa: '7.0',
        max_backlogs: '0',
        graduation_year: '2027',
        min_tenth_percentage: '60',
        min_twelfth_percentage: '60',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save drive.');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this placement drive?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Placement Drives Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create and publish campus hiring drives with automated eligibility criteria.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-200 transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Drive
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-500">
          Loading placement drives...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {job.company_name}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {job.title}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      job.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600 mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-bold">
                    {job.ctc}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">
                    Min CGPA: {job.min_cgpa}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">
                    Max Backlogs: {job.max_backlogs}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Drive: {formatDate(job.drive_date)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(job)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingJobId ? 'Edit Placement Drive' : 'Create New Placement Drive'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. ABC Technologies"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Role Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
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
                    placeholder="₹12.0 LPA"
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

              {/* Eligibility Criteria Box */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 uppercase">
                  Automatic Eligibility Thresholds
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
                    <label className="block text-[11px] font-bold text-indigo-800 mb-1">Max Backlogs</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {editingJobId ? 'Update Drive' : 'Publish Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
