import axios from 'axios';

const api = axios.create({ baseURL: 'https://thosc-hms-backend.onrender.com' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thosc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('thosc_token');
      localStorage.removeItem('thosc_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
