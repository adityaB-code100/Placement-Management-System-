import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  FileCheck,
  Award,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              PlacementCell<span className="text-indigo-600">.ai</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Smart Campus Recruitment System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 lg:px-12 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Automated Eligibility Checking & Campus Drive Automation</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Manage Campus Placements <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Smarter & Faster
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          A unified cloud platform connecting Students, Placement Officers, and Enterprise Recruiters.
          Verify eligibility rules automatically, track candidate stages, schedule interviews, and analyze recruitment metrics.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login?role=student"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5" /> Student Login
          </Link>
          <Link
            to="/login?role=recruiter"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-300 transition flex items-center gap-2"
          >
            <Building2 className="w-5 h-5" /> Recruiter Login
          </Link>
          <Link
            to="/login?role=admin"
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-200 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" /> Officer Admin
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-3xl font-black text-indigo-600">85%+</h3>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Placement Rate</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-3xl font-black text-slate-900">120+</h3>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Visiting Companies</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-3xl font-black text-indigo-600">₹24 LPA</h3>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Highest Package</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-3xl font-black text-slate-900">₹8.5 LPA</h3>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Average CTC</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white border-y border-slate-200 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Complete End-to-End Recruitment Suite
            </h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              Eliminate manual spreadsheets and email back-and-forths with automated verification workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Automatic Eligibility Checker</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Compares CGPA, active backlogs, department, 10th/12th percentages, and graduation year automatically before allowing job applications.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Visual Application Pipeline</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Real-time recruitment stepper mapping candidate progress from Applied to Shortlisted, Technical Interview, HR, and Offer Selection.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Placement Analytics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Interactive charts using Recharts for branch-wise placement percentages, company selections, monthly application trends, and salary packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How It Works</h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Simple 4-Step Recruitment Journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">1</span>
            <h4 className="font-bold text-slate-900 text-sm">Create Profile</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Add academic details, CGPA, skills, & resume URL.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">2</span>
            <h4 className="font-bold text-slate-900 text-sm">Check Eligibility</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">System instantly evaluates eligibility against drive requirements.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">3</span>
            <h4 className="font-bold text-slate-900 text-sm">Apply & Track</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Submit application and monitor status changes live.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">4</span>
            <h4 className="font-bold text-slate-900 text-sm">Get Placed</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Attend scheduled interviews and receive offer letters!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 px-6 lg:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-200 font-bold">Cloud-Based Placement Cell</span>
          </div>
          <p>© 2026 Campus Recruitment Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
