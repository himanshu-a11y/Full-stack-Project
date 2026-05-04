import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('skillbridge_token');
  const role = localStorage.getItem('skillbridge_role');

  if (!token) {
    // No token, send to appropriate login
    const loginPath = requiredRole === 'employer' ? '/employer/login' : '/student/login';
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Role mismatch, send back to home or appropriate dash
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
