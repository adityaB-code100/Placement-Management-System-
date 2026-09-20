import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Building2,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout, role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Placement Officer
          </span>
        );
      case 'recruiter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Building2 className="w-3.5 h-3.5" /> Recruiter
          </span>
        );
      case 'student':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              PlacementCell<span className="text-indigo-600">.ai</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Campus Recruitment Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {user && (
          <>
            {getRoleBadge()}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowBellDropdown(!showBellDropdown);
                  setShowUserDropdown(false);
                }}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
                title="In-app Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Bell Dropdown */}
              {showBellDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Notifications ({unreadCount} unread)
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications found.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 ${
                            !n.is_read ? 'bg-indigo-50/50 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatDate(n.created_at)}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowBellDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {user.full_name}
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  {role === 'student' && (
                    <Link
                      to="/student/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
