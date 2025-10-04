import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The token from the backend is just the string, but the header needs "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;