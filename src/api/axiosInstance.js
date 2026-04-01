import axios from 'axios';

// 1. Definimos el fallback (IP de tu servidor backend)
const DEFAULT_API_URL = 'http://192.168.1.23:8090/api/v1';

// 2. Obtenemos la URL de Vite
const envApiUrl = import.meta.env.VITE_API_URL;

// 3. Lógica de validación: 
// Si la variable de entorno empieza con "/", es una ruta relativa y causará el 404 en el puerto 3000.
// Solo usamos la variable de entorno si es una URL completa (empieza con http).
const finalBaseURL = (envApiUrl && envApiUrl.startsWith('http')) 
    ? envApiUrl 
    : DEFAULT_API_URL;


const axiosInstance = axios.create({
  baseURL: finalBaseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor: Antes de cada petición, busca el token y lo pega en el Header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;