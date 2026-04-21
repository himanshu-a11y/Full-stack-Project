import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy imports — all pages load only when needed
const Home             = lazy(() => import('./pages/Home'));
const StudentRegister  = lazy(() => import('./pages/StudentRegister'));
const StudentLogin     = lazy(() => import('./pages/StudentLogin'));
const StudentProfile   = lazy(() => import('./pages/StudentProfile'));
const JobList          = lazy(() => import('./pages/JobList'));
const AdminImport      = lazy(() => import('./pages/AdminImport'));
const EmployerRegister = lazy(() => import('./pages/EmployerRegister'));
const EmployerLogin    = lazy(() => import('./pages/EmployerLogin'));
const PostJob          = lazy(() => import('./pages/PostJob'));
const CandidateList    = lazy(() => import('./pages/CandidateList'));

// Simple 404 page
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">404 — Page not found</h2>
    <p className="text-gray-600">The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
        </div>
      }>
        <Routes>
          {/* Default redirect to landing page */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />

          {/* Student routes */}
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login"    element={<StudentLogin />} />
          <Route path="/student/profile"  element={<StudentProfile />} />

          {/* Employer routes */}
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/dashboard" element={<PostJob />} />
          <Route path="/employer/jobs/:id/candidates" element={<CandidateList />} />

          {/* Public routes */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/admin/import" element={<AdminImport />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;