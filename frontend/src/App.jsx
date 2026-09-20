import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common UI
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentDrivesPage } from './pages/student/StudentDrivesPage';
import { DriveDetailsPage } from './pages/student/DriveDetailsPage';
import { StudentApplicationsPage } from './pages/student/StudentApplicationsPage';
import { StudentInterviewsPage } from './pages/student/StudentInterviewsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsManagement } from './pages/admin/StudentsManagement';
import { CompaniesManagement } from './pages/admin/CompaniesManagement';
import { DrivesManagement } from './pages/admin/DrivesManagement';
import { ApplicationsManagement } from './pages/admin/ApplicationsManagement';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterCompanyPage } from './pages/recruiter/RecruiterCompanyPage';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { ApplicantsManagement } from './pages/recruiter/ApplicantsManagement';

// Layout for Dashboard Pages
const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Protected Route Wrapper with Role Authorization
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to proper role home
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <DashboardLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfilePage />} />
              <Route path="/student/drives" element={<StudentDrivesPage />} />
              <Route path="/student/drives/:id" element={<DriveDetailsPage />} />
              <Route path="/student/applications" element={<StudentApplicationsPage />} />
              <Route path="/student/interviews" element={<StudentInterviewsPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsManagement />} />
              <Route path="/admin/companies" element={<CompaniesManagement />} />
              <Route path="/admin/drives" element={<DrivesManagement />} />
              <Route path="/admin/applications" element={<ApplicationsManagement />} />
            </Route>

            {/* Recruiter Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
              <Route path="/recruiter/post-job" element={<PostJobPage />} />
              <Route path="/recruiter/applicants" element={<ApplicantsManagement />} />
            </Route>

            {/* Fallback Catch-All Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
