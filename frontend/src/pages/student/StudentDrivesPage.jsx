import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Briefcase, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';
import { DEPARTMENTS, JOB_TYPES } from '../../utils/constants';

export const StudentDrivesPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('ALL');
  const [jobType, setJobType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (branch && branch !== 'ALL') params.append('branch', branch);
      if (jobType) params.append('job_type', jobType);
      params.append('status', 'Active');

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch placement drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, branch, jobType]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Placement Drives Catalog</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse campus placement opportunities and check real-time automatic eligibility status.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role, company, or city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>

        <div>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
          >
            <option value="ALL">All Eligible Branches</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
          >
            <option value="">All Job Types</option>
            {JOB_TYPES.map((jt) => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drive Cards List */}
      {loading ? (
        <LoadingSkeleton count={3} type="card" />
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <Briefcase className="w-12 h-12 mx-auto stroke-1 mb-3" />
          <h3 className="font-bold text-slate-700 text-base">No Placement Drives Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting search filters or check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600 mt-0.5">
                        {job.company_name}
                      </p>
                    </div>
                  </div>

                  <EligibilityBadge eligibility={job.eligibility} />
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600 mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                    {job.ctc}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <MapPin className="w-3 h-3 inline mr-1" /> {job.location} ({job.work_mode})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {job.job_type}
                  </span>
                </div>

                {/* Requirements Snapshot */}
                <div className="p-3 bg-slate-50 rounded-2xl text-[11px] space-y-1 text-slate-600 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Min CGPA Required:</span>
                    <span className="font-bold text-slate-900">{job.min_cgpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Allowed Branches:</span>
                    <span className="font-bold text-slate-900">
                      {Array.isArray(job.eligible_branches) ? job.eligible_branches.join(', ') : job.eligible_branches}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Max Active Backlogs:</span>
                    <span className="font-bold text-slate-900">{job.max_backlogs}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-medium text-slate-400">
                  Drive Date: <strong className="text-slate-700">{formatDate(job.drive_date)}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {job.application_status ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                      Applied ({job.application_status})
                    </span>
                  ) : (
                    <Link
                      to={`/student/drives/${job.id}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      View Details & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
