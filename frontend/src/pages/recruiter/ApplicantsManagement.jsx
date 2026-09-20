import React, { useState, useEffect } from 'react';
import { Users, Calendar, ExternalLink, CheckCircle2, FileText, Clock } from 'lucide-react';
import api from '../../services/api';
import { RECRUITMENT_STAGES } from '../../utils/constants';
import { formatDate, getStatusColor } from '../../utils/formatters';

export const ApplicantsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interview Schedule Modal
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [scheduleTargetApp, setScheduleTargetApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    round: 'Technical Interview',
    date: '',
    time: '10:00 AM',
    meeting_link: 'https://meet.google.com/xyz-tech-round',
    location: 'Online / Google Meet',
    notes: 'Please keep your IDE ready and review data structures concepts.'
  });

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await api.get('/jobs?my_jobs=true&status=all');
        const jobList = res.data || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          setSelectedJobId(jobList[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const handleStageUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        notes: `Stage updated to ${newStatus} by recruiter.`
      });
      fetchApplicants(selectedJobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate stage.');
    }
  };

  const handleOpenScheduleModal = (app) => {
    setScheduleTargetApp(app);
    setShowInterviewModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleTargetApp) return;

    try {
      await api.post('/interviews', {
        student_id: scheduleTargetApp.student_id,
        job_id: scheduleTargetApp.job_id,
        round: interviewForm.round,
        date: interviewForm.date,
        time: interviewForm.time,
        meeting_link: interviewForm.meeting_link,
        location: interviewForm.location,
        notes: interviewForm.notes
      });
      alert('Interview round scheduled and student notified successfully!');
      setShowInterviewModal(false);
      fetchApplicants(selectedJobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule interview.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Applicants & Shortlist Pipeline</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Evaluate eligible candidate profiles, update hiring stages, and schedule interview rounds.
          </p>
        </div>

        {jobs.length > 0 && (
          <div className="shrink-0">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.ctc})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Applicants List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Candidate Student</th>
                <th className="p-4">Department & CGPA</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Resume</th>
                <th className="p-4">Stage Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    Loading applicants...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    No applicants submitted for this job opening yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const snapshot = app.student_snapshot || {};
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">
                        <div>{snapshot.full_name || 'Candidate'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {snapshot.email} • {snapshot.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-bold">
                          {snapshot.department || 'N/A'}
                        </span>
                        <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                          CGPA: {snapshot.cgpa || 'N/A'} ({snapshot.active_backlogs ?? 0} backlogs)
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(app.created_at)}</td>
                      <td className="p-4">
                        {snapshot.resume_url ? (
                          <a
                            href={snapshot.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                          >
                            View PDF <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStageUpdate(app.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                        >
                          {RECRUITMENT_STAGES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleOpenScheduleModal(app)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl shadow-xs transition flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Schedule Round
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && scheduleTargetApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Schedule Assessment / Interview
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Candidate: {scheduleTargetApp.student_snapshot?.full_name}
                </p>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Round</label>
                <select
                  value={interviewForm.round}
                  onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="Final Managerial Round">Final Managerial Round</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    placeholder="11:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Teams)</label>
                <input
                  type="url"
                  required
                  value={interviewForm.meeting_link}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Notes for Candidate</label>
                <textarea
                  rows="2"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Schedule & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
