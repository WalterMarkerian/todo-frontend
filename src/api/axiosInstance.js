import axios from 'axios';

const axiosInstance = axios.create({
    // Vite reemplaza esto en tiempo de compilación
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Esto es genial para debuguear en la consola del navegador (F12)
if (import.meta.env.DEV) {
    console.log("🛠️ Modo Desarrollo - API en:", import.meta.env.VITE_API_URL);
}

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;