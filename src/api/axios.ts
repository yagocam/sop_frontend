import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://sop-challenge-back-production.up.railway.app',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set?.('Authorization', `Bearer ${token}`);
    }
  }
  console.log('[AXIOS REQUEST]');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
  return config;
});

export default api;

