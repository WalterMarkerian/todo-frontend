import axios from 'axios';

const axiosInstance = axios.create({
    // Vite reemplaza esto en tiempo de compilación
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        // ESTO ES LO QUE NECESITÁS PARA NGROK:
        'ngrok-skip-browser-warning': 'true'
    }
});

// Interceptor de solicitudes
axiosInstance.interceptors.request.use((config) => {
    // 1. Manejo del Token JWT
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Debug en consola (opcional)
    if (import.meta.env.DEV) {
        console.log(`🚀 Llamando a: ${config.baseURL}${config.url}`);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de respuestas (Opcional pero recomendado para manejar el 403/401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("🚫 Sesión expirada o falta de permisos");
            // Acá podrías hacer un localStorage.removeItem('token') y redirigir al login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;