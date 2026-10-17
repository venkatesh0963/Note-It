import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('noteit_user');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error('Error parsing stored token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
