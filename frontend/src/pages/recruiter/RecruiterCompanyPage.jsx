import React, { useState, useEffect } from 'react';
import { Building2, Save, Globe, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const RecruiterCompanyPage = () => {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [companyData, setCompanyData] = useState({
    company_name: '',
    logo_url: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    hr_name: '',
    hr_email: '',
    hr_phone: ''
  });

  useEffect(() => {
    if (profile) {
      setCompanyData({
        company_name: profile.company_name || '',
        logo_url: profile.logo_url || '',
        description: profile.description || '',
        industry: profile.industry || '',
        website: profile.website || '',
        location: profile.location || '',
        hr_name: profile.hr_name || '',
        hr_email: profile.hr_email || '',
        hr_phone: profile.hr_phone || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profile?.id) {
        await api.put(`/companies/${profile.id}`, companyData);
      } else {
        await api.post('/companies', companyData);
      }
      await refreshProfile();
      setMessage('Company profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900">Company Profile Details</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Keep your corporate profile and HR point of contact details updated.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
          {message}
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyData.company_name}
                onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
              <input
                type="text"
                required
                value={companyData.industry}
                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Website</label>
              <input
                type="url"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                placeholder="https://company.example.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image URL</label>
              <input
                type="url"
                value={companyData.logo_url}
                onChange={(e) => setCompanyData({ ...companyData, logo_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company Overview</label>
            <textarea
              rows="3"
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase">
              HR / Talent Acquisition Lead Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">HR Full Name</label>
                <input
                  type="text"
                  required
                  value={companyData.hr_name}
                  onChange={(e) => setCompanyData({ ...companyData, hr_name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">HR Email</label>
                <input
                  type="email"
                  required
                  value={companyData.hr_email}
                  onChange={(e) => setCompanyData({ ...companyData, hr_email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">HR Phone</label>
                <input
                  type="text"
                  value={companyData.hr_phone}
                  onChange={(e) => setCompanyData({ ...companyData, hr_phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
