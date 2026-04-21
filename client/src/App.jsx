import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy imports — all pages load only when needed
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
  <div style={{ textAlign: 'center', marginTop: '80px' }}>
    <h2>404 — Page not found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/jobs" replace />} />

          {/* Student routes */}
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
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