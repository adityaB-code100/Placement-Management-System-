import React, { useState, useEffect } from 'react';
import { Search, Users, ExternalLink, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import { DEPARTMENTS } from '../../utils/constants';

export const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('ALL');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (branch && branch !== 'ALL') params.append('branch', branch);

      const res = await api.get(`/admin/students?${params.toString()}`);
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, branch]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage registered student profiles, academic CGPA scores, and backlogs.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>

        <div>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Grad Year</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Backlogs</th>
                <th className="p-4">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    No students found matching search.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const personal = student.personal_info || {};
                  const academic = student.academic_info || {};
                  const prof = student.professional_info || {};

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">
                        <div>{personal.full_name || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {personal.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                          {academic.department || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">{academic.graduation_year || '2027'}</td>
                      <td className="p-4 font-black text-slate-900">
                        {academic.cgpa ? parseFloat(academic.cgpa).toFixed(1) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                            (academic.active_backlogs || 0) === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {academic.active_backlogs ?? 0} active
                        </span>
                      </td>
                      <td className="p-4">
                        {prof.resume_url ? (
                          <a
                            href={prof.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                          >
                            Resume <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">Not uploaded</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
