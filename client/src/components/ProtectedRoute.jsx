import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('skillbridge_token');
  const role = localStorage.getItem('skillbridge_role');

  if (!token) {
    // No token, send to appropriate login
    let loginPath = '/student/login';
    if (requiredRole === 'employer') loginPath = '/employer/login';
    if (requiredRole === 'admin') loginPath = '/admin/login';
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Role mismatch, send back to home or appropriate dash
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
