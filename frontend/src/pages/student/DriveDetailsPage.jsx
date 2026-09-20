import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import api from '../../services/api';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { formatDate } from '../../utils/formatters';

export const DriveDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await api.post('/applications', { job_id: id });
      setFeedback({
        type: 'success',
        text: 'Application submitted successfully! Track progress in "My Applications".'
      });
      fetchJobDetails();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.'
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-slate-500">Loading drive details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-xs font-bold text-slate-500">Placement drive not found.</div>;
  }

  const eligibility = job.eligibility || { is_eligible: false, reasons: [] };
  const isEligible = eligibility.is_eligible;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/student/drives"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Placement Drives
      </Link>

      {/* Main Hero Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center shrink-0">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-indigo-600" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                {job.title}
              </h1>
              <p className="text-sm font-bold text-indigo-600 mt-0.5">
                {job.company_name}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-500">
                <span><MapPin className="w-3.5 h-3.5 inline text-slate-400" /> {job.location} ({job.work_mode})</span>
                <span>•</span>
                <span>{job.job_type}</span>
              </div>
            </div>
          </div>

          <EligibilityBadge eligibility={eligibility} />
        </div>

        {/* Salary and Dates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-700 uppercase">Package CTC</span>
            <p className="text-lg font-black text-indigo-900 mt-0.5">{job.ctc}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Drive Date</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{formatDate(job.drive_date)}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Application Deadline</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{formatDate(job.application_deadline)}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Graduation Batch</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{job.graduation_year}</p>
          </div>
        </div>

        {/* Application Action Section */}
        {feedback.text && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {job.application ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">
                  You have already applied! Current status: <strong>{job.application.status}</strong>
                </span>
              </div>
            ) : isEligible ? (
              <span className="text-xs font-semibold text-emerald-700">
                ✅ You meet all mandatory eligibility criteria for this placement drive.
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-700">
                ❌ You do not satisfy mandatory requirements. Check breakdown below.
              </span>
            )}
          </div>

          {!job.application && (
            <button
              onClick={handleApply}
              disabled={!isEligible || applying}
              className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition flex items-center gap-2 ${
                isEligible
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              {applying ? 'Submitting...' : 'Apply For Placement Drive'}
            </button>
          )}
        </div>
      </div>

      {/* Eligibility Breakdown Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Automatic Eligibility Requirements Checklist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>Minimum CGPA Required</span>
            <span className="font-bold text-slate-900">&ge; {job.min_cgpa}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>Maximum Active Backlogs</span>
            <span className="font-bold text-slate-900">&le; {job.max_backlogs}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>Eligible Branches</span>
            <span className="font-bold text-slate-900">
              {Array.isArray(job.eligible_branches) ? job.eligible_branches.join(', ') : job.eligible_branches}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>Minimum 10th Score</span>
            <span className="font-bold text-slate-900">&ge; {job.min_tenth_percentage || 60}%</span>
          </div>
        </div>

        {!isEligible && eligibility.reasons?.length > 0 && (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
            <h4 className="text-xs font-bold text-rose-800">
              Ineligibility Summary:
            </h4>
            <ul className="space-y-1">
              {eligibility.reasons.map((r, i) => (
                <li key={i} className="text-xs text-rose-700 font-medium">
                  • {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Description & Skills */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Job Description & Responsibilities</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
          {job.description}
        </p>

        {job.required_skills?.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-2">Required Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
