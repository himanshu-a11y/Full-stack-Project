import api from './axios';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillbridge_token');
      localStorage.removeItem('skillbridge_role');
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

export default api;