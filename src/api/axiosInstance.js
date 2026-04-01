import axios from 'axios';
console.log("Mi URL de API es:", import.meta.env.VITE_API_URL);
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.23:8090/api/v1',
});

// Interceptor: Antes de cada petición, busca el token y lo pega en el Header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;