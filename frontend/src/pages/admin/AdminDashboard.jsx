import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  FileCheck2,
  TrendingUp,
  Award,
  CheckCircle2,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import api from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics')
        ]);
        setDashboard(dashRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={4} type="card" />;
  }

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" /> Placement Cell Officer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Campus Placement Analytics</h1>
          <p className="text-xs text-indigo-200 mt-1 font-medium">
            Real-time recruitment stats, company approvals, drive tracking, and offer metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-300 uppercase">Placement Rate</span>
            <p className="text-2xl font-black text-amber-400">
              {dashboard?.placement_percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Top 8 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={dashboard?.total_students ?? 0}
          subtitle={`${dashboard?.registered_students ?? 0} Active registered`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Approved Companies"
          value={dashboard?.total_companies ?? 0}
          subtitle={`${dashboard?.pending_companies ?? 0} Pending approval`}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Active Drives"
          value={dashboard?.active_drives ?? 0}
          subtitle="Open campus hiring"
          icon={Briefcase}
          color="amber"
        />
        <StatCard
          title="Total Placed"
          value={dashboard?.total_placed ?? 0}
          subtitle={`${dashboard?.placement_percentage}% Batch rate`}
          icon={Award}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Applications Sent"
          value={dashboard?.total_applications ?? 0}
          subtitle="Total candidate submissions"
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Shortlisted Count"
          value={dashboard?.shortlisted_students ?? 0}
          subtitle="Advanced to interview"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Average CTC"
          value={dashboard?.avg_package ?? '₹8.5 LPA'}
          subtitle="Mean package offered"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Highest CTC"
          value={dashboard?.highest_package ?? '₹24 LPA'}
          subtitle="Top package offered"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* Recharts Analytics Section */}
      {analytics && (
        <div className="space-y-6">
          {/* Row 1: Branch-wise & Company-wise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Branch-wise Placement Statistics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">
                1. Branch-Wise Placement Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.branch_wise}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="total" name="Total Batch" fill="#C7D2FE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" name="Placed Students" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Company-wise Selections */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">
                2. Top Company Selections
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.company_wise} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis dataKey="company" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={110} />
                    <Tooltip />
                    <Bar dataKey="selections" name="Selections" fill="#10B981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Applications Monthly & Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 3: Applications by Month */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">
                3. Application Submissions Monthly Trend
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.applications_monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="#4F46E5" fill="#E0E7FF" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Status Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">
                4. Application Pipeline Breakdown
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.status_distribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name }) => name}
                    >
                      {analytics.status_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
