import React, { useState, useEffect } from 'react';
import { User, BookOpen, Briefcase, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS } from '../../utils/constants';

export const StudentProfilePage = () => {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form States
  const [personal, setPersonal] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: ''
  });

  const [academic, setAcademic] = useState({
    college: 'Institute of Technology',
    department: 'CSE',
    graduation_year: '2027',
    tenth_percentage: '85',
    twelfth_percentage: '82',
    diploma_percentage: '0',
    cgpa: '8.0',
    active_backlogs: '0',
    total_backlogs: '0'
  });

  const [professional, setProfessional] = useState({
    skills: ['Python', 'React', 'JavaScript'],
    certifications: [],
    projects: [],
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    resume_url: ''
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (profile) {
      setPersonal(profile.personal_info || {});
      setAcademic(profile.academic_info || {});
      setProfessional(profile.professional_info || {});
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/students/profile', {
        personal_info: personal,
        academic_info: academic,
        professional_info: professional
      });
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (!professional.skills.includes(skillInput.trim())) {
      setProfessional({
        ...professional,
        skills: [...(professional.skills || []), skillInput.trim()]
      });
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setProfessional({
      ...professional,
      skills: (professional.skills || []).filter((s) => s !== skillToRemove)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Profile</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Keep your academic scores and resume updated for automated company eligibility checks.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 p-3 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Completeness</span>
            <p className="text-lg font-black text-indigo-700">
              {profile?.completion_percentage || 0}%
            </p>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'personal'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Personal Details
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'academic'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Academic Info
          </button>
          <button
            onClick={() => setActiveTab('professional')}
            className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'professional'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Skills & Resume
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
          {/* Tab 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={personal.full_name || ''}
                    onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    disabled
                    value={personal.email || ''}
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={personal.phone || ''}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={personal.dob || ''}
                    onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={personal.gender || 'Male'}
                    onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Address</label>
                <textarea
                  rows="2"
                  value={personal.address || ''}
                  onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Academic Info */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    value={academic.college || ''}
                    onChange={(e) => setAcademic({ ...academic, college: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department / Branch</label>
                  <select
                    value={academic.department || 'CSE'}
                    onChange={(e) => setAcademic({ ...academic, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={academic.graduation_year || '2027'}
                    onChange={(e) => setAcademic({ ...academic, graduation_year: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">10th Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academic.tenth_percentage || ''}
                    onChange={(e) => setAcademic({ ...academic, tenth_percentage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">12th Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academic.twelfth_percentage || ''}
                    onChange={(e) => setAcademic({ ...academic, twelfth_percentage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-indigo-700 mb-1">Current CGPA (out of 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={academic.cgpa || ''}
                    onChange={(e) => setAcademic({ ...academic, cgpa: e.target.value })}
                    className="w-full px-3.5 py-2 bg-indigo-50 border border-indigo-200 font-bold text-indigo-900 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-700 mb-1">Active Backlogs Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={academic.active_backlogs ?? 0}
                    onChange={(e) => setAcademic({ ...academic, active_backlogs: e.target.value })}
                    className="w-full px-3.5 py-2 bg-rose-50 border border-rose-200 font-bold text-rose-900 rounded-xl text-xs focus:ring-2 focus:ring-rose-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Cleared Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={academic.total_backlogs ?? 0}
                    onChange={(e) => setAcademic({ ...academic, total_backlogs: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Skills & Professional */}
          {activeTab === 'professional' && (
            <div className="space-y-5">
              {/* Skills Tag Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. Python, Docker, React, SQL"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(professional.skills || []).map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeSkill(sk)}
                        className="text-indigo-400 hover:text-rose-600 font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={professional.github_url || ''}
                    onChange={(e) => setProfessional({ ...professional, github_url: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={professional.linkedin_url || ''}
                    onChange={(e) => setProfessional({ ...professional, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-700 mb-1">
                  Resume Link (PDF / Google Drive URL)
                </label>
                <input
                  type="url"
                  required
                  value={professional.resume_url || ''}
                  onChange={(e) => setProfessional({ ...professional, resume_url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/your-resume-pdf/view"
                  className="w-full px-3.5 py-2 bg-indigo-50 border border-indigo-200 font-semibold text-indigo-900 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
