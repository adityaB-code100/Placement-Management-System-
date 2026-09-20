import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileCheck2,
  CalendarDays,
  Building2,
  Users,
  BarChart3,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
          { to: '/admin/drives', label: 'Placement Drives', icon: Briefcase },
          { to: '/admin/students', label: 'Student Directory', icon: Users },
          { to: '/admin/companies', label: 'Companies & Approval', icon: Building2 },
          { to: '/admin/applications', label: 'Applications Pipeline', icon: FileCheck2 },
        ];

      case 'recruiter':
        return [
          { to: '/recruiter/dashboard', label: 'Recruiter Dashboard', icon: LayoutDashboard },
          { to: '/recruiter/post-job', label: 'Post Placement Drive', icon: PlusCircle },
          { to: '/recruiter/applicants', label: 'Applicants & Shortlist', icon: Users },
          { to: '/recruiter/company', label: 'Company Profile', icon: Building2 },
        ];

      case 'student':
      default:
        return [
          { to: '/student/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { to: '/student/drives', label: 'Placement Opportunities', icon: Briefcase },
          { to: '/student/applications', label: 'My Applications', icon: FileCheck2 },
          { to: '/student/interviews', label: 'Interview Schedules', icon: CalendarDays },
          { to: '/student/profile', label: 'My Academic Profile', icon: UserCheck },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
            Main Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* System Banner footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl border">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold mb-1">
            <ShieldAlert className="w-4 h-4" /> Campus Cell v1.0
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Automated eligibility verification & recruitment system.
          </p>
        </div>
      </aside>
    </>
  );
};
