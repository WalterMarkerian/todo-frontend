import api from './axiosInstance';

export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    return data; // Retorna { token: "..." }
  }
};