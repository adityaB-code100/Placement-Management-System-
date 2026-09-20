import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, Users, CheckCircle2, PlusCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';

export const RecruiterDashboard = () => {
  const { profile } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const jobsRes = await api.get('/jobs?my_jobs=true&status=all');
        setMyJobs(jobsRes.data || []);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  const companyStatus = profile?.status || 'pending';
  const isApproved = companyStatus === 'approved';

  return (
    <div className="space-y-6">
      {/* Company Header & Approval Alert */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 font-bold border border-purple-100 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {profile?.company_name || 'Recruiter Portal'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {profile?.industry || 'Corporate Partner'} • {profile?.location || 'India'}
              </p>
            </div>
          </div>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-extrabold border uppercase ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
            }`}
          >
            Status: {companyStatus}
          </span>
        </div>

        {!isApproved && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Company Approval Pending:</strong> Your company profile is currently under review by the Placement Director. Once approved, your posted placement drives will become visible to eligible students.
            </div>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Drives"
          value={myJobs.filter((j) => j.status === 'Active').length}
          subtitle="Currently open positions"
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Total Positions"
          value={myJobs.length}
          subtitle="All created job openings"
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Recruitment Actions"
          value="Shortlist Candidates"
          subtitle="Evaluate eligible applicants"
          icon={Users}
          color="emerald"
        />
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-3xl text-white flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Hiring for 2026-27 Campus Batch?</h3>
          <p className="text-xs text-purple-200 mt-1">
            Define role parameters, CTC, and eligibility rules to find top campus talent.
          </p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-purple-950 font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-purple-700" /> Post Placement Opportunity
        </Link>
      </div>
    </div>
  );
};
