import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillbridge_token');
  console.log('Axios Interceptor - URL:', config.url, 'Token found:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;