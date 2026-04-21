import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('skillbridge_token');
  const role = localStorage.getItem('skillbridge_role');

  useEffect(() => {
    if (!token) {
      navigate('/student/login');
      return;
    }
    if (requiredRole && role !== requiredRole) {
      navigate(role === 'employer' ? '/employer/login' : '/student/login');
    }
  }, [token, role, requiredRole, navigate]);

  if (!token || (requiredRole && role !== requiredRole)) return null;
  return children;
};

export default ProtectedRoute;