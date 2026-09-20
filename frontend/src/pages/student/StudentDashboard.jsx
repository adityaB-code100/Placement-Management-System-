import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileCheck2,
  Calendar,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { formatDate } from '../../utils/formatters';

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, jobsRes, interviewsRes] = await Promise.all([
          api.get('/students/stats'),
          api.get('/jobs?status=Active'),
          api.get('/interviews/my')
        ]);

        setStats(statsRes.data);
        
        // Filter jobs for which student is eligible
        const eligibleList = (jobsRes.data || []).filter(
          (j) => j.eligibility?.is_eligible
        );
        setRecommendedJobs(eligibleList.slice(0, 3));

        setUpcomingInterviews(interviewsRes.data || []);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionPct = stats?.completion_percentage || profile?.completion_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Profile Progress */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Recruitment Season 2026-27</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {profile?.personal_info?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 font-medium">
            Department of {profile?.academic_info?.department || 'Engineering'} • CGPA: {profile?.academic_info?.cgpa || 'N/A'} • Active Backlogs: {profile?.academic_info?.active_backlogs ?? 0}
          </p>

          {/* Profile Completion Bar */}
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xl">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-indigo-100">Profile Completeness</span>
              <span className="text-amber-300">{completionPct}% Completed</span>
            </div>
            <div className="w-full bg-indigo-950/60 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {completionPct < 80 && (
              <p className="text-[11px] text-indigo-200 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Complete your profile to ensure seamless eligibility evaluation for top companies!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Eligible Drives"
          value={stats?.eligible_jobs_count ?? 0}
          subtitle="Opportunities matching profile"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Applications Sent"
          value={stats?.total_applications ?? 0}
          subtitle="Track application stages"
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Shortlisted Rounds"
          value={stats?.shortlisted_count ?? 0}
          subtitle="Progressed candidates"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Placement Offer"
          value={stats?.is_placed ? 'PLACED 🎉' : 'In Progress'}
          subtitle={stats?.is_placed ? 'Congratulations!' : 'Active campus season'}
          icon={CheckCircle}
          color={stats?.is_placed ? 'emerald' : 'purple'}
        />
      </div>

      {/* Recommended Opportunities Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Recommended Placement Drives
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Companies where your profile meets 100% of eligibility criteria
            </p>
          </div>
          <Link
            to="/student/drives"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendedJobs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              No recommended active drives at the moment or profile incomplete.
            </p>
            <Link
              to="/student/drives"
              className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:underline"
            >
              Browse All Drives Catalog &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="font-bold text-indigo-600 text-xs">
                          {job.company_name?.[0]}
                        </span>
                      )}
                    </div>
                    <EligibilityBadge eligibility={job.eligibility} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    {job.company_name}
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold">
                      {job.ctc}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Drive: {formatDate(job.drive_date)}
                  </span>
                  <Link
                    to={`/student/drives/${job.id}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Interviews Widget */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Upcoming Interview Schedule
        </h2>

        {upcomingInterviews.length === 0 ? (
          <p className="text-xs text-slate-500 font-medium py-2">
            No upcoming interviews scheduled.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900 font-bold text-[10px]">
                      {interview.round}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {interview.job_title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {interview.company_name} • Date: <strong>{interview.date}</strong> at <strong>{interview.time}</strong>
                  </p>
                </div>

                {interview.meeting_link && (
                  <a
                    href={interview.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    Join Meeting <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
