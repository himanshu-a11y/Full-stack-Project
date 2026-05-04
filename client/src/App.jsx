import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy imports — all pages load only when needed
const Home = lazy(() => import('./pages/Home'));
const StudentRegister = lazy(() => import('./pages/StudentRegister'));
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const JobList = lazy(() => import('./pages/JobList'));
const AdminImport = lazy(() => import('./pages/AdminImport'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const EmployerRegister = lazy(() => import('./pages/EmployerRegister'));
const EmployerLogin = lazy(() => import('./pages/EmployerLogin'));
const PostJob = lazy(() => import('./pages/PostJob'));
const CandidateList = lazy(() => import('./pages/CandidateList'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const ApplicationSuccess = lazy(() => import('./pages/ApplicationSuccess'));

// Simple 404 page
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">404 — Page not found</h2>
    <p className="text-gray-600">The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  const [token, setToken] = import.meta.env.SSR ? [null] : useState(localStorage.getItem('skillbridge_token'));

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('skillbridge_token'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      {!token && <Navbar />}
      <div className={`${!token ? 'pt-20' : ''} bg-[#F8FAFC] min-h-screen`}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
          </div>
        }>
          <Routes>
            {/* Default redirect to landing page */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            {/* Student routes */}
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Employer routes */}
            <Route path="/employer/register" element={<EmployerRegister />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute requiredRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/post-job"
              element={
                <ProtectedRoute requiredRole="employer">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs/:id/candidates"
              element={
                <ProtectedRoute requiredRole="employer">
                  <CandidateList />
                </ProtectedRoute>
              }
            />

            {/* Public & Admin routes */}
            <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute requiredRole="student"><JobDetails /></ProtectedRoute>} />
            <Route path="/application-success" element={<ProtectedRoute requiredRole="student"><ApplicationSuccess /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/import"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminImport />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;