import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, XCircle, Clock, ExternalLink, Globe, Mail, Phone } from 'lucide-react';
import api from '../../services/api';

export const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/admin/companies' : `/admin/companies?status=${filter}`;
      const res = await api.get(url);
      setCompanies(res.data || []);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const handleApproveReject = async (companyId, newStatus) => {
    try {
      await api.put(`/companies/${companyId}/approve`, { status: newStatus });
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update company status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Companies & Recruiter Approvals</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review recruiter registrations. Only approved companies can publish placement drives.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            All Companies
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              filter === 'pending' ? 'bg-amber-400 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              filter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-500">
          Loading company profiles...
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-base">No Companies Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.company_name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {company.company_name}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600">
                        {company.industry}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      company.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : company.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                    }`}
                  >
                    {company.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                  {company.description || 'No description provided.'}
                </p>

                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>HR Representative:</span>
                    <strong className="text-slate-900">{company.hr_name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HR Email:</span>
                    <strong className="text-slate-900">{company.hr_email}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location:</span>
                    <strong className="text-slate-900">{company.location || 'Remote'}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  {company.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveReject(company.id, 'approved')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {company.status !== 'rejected' && (
                    <button
                      onClick={() => handleApproveReject(company.id, 'rejected')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
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
