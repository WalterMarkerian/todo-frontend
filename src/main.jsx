import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // Importamos axios
import './index.css'
import App from './App.jsx'

// CONFIGURACIÓN GLOBAL DE AXIOS
// 1. Tomamos la URL de las variables de entorno (.env.development o .env.production)
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// 2. Agregamos el header para saltar la advertencia de ngrok
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

// 3. (Opcional) Si manejas JWT, podés configurar el Content-Type por defecto
axios.defaults.headers.post['Content-Type'] = 'application/json';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)