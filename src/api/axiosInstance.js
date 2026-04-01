import axios from 'axios';

const getBaseURL = () => {
    // 1. Prioridad: Variable de entorno (para producción real o Docker Compose)
    const envApiUrl = import.meta.env.VITE_API_URL;
    if (envApiUrl && envApiUrl.startsWith('http')) {
        return envApiUrl;
    }

    // 2. Magia Dinámica: Usa la IP o Dominio desde donde el usuario entró
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname; 
        // Si entras por 192.168.1.23:3000 -> llama a 192.168.1.23
        // Si entras por 100.64.0.15:3000 -> llama a 100.64.0.15
        // Si entras por localhost:3000 -> llama a localhost
        return `http://${hostname}/api/v1`;
    }

    // 3. Último recurso (solo si falla todo lo anterior)
    return '/api/v1'; 
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    }
});

console.log("🌐 API conectada a:", axiosInstance.defaults.baseURL);

// Interceptor para el Token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;