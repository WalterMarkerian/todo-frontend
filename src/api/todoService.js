import api from './axiosInstance';

export const todoService = {
  getAll: async (page, size) => {
    const { data } = await api.get('/todos', { 
      params: { page, size, sort: 'id,desc' } 
    });
    return data;
  },
  create: async (title, description) => {
    return await api.post('/todos', { title, description });
  },
  toggle: async (id) => {
    return await api.patch(`/todos/${id}/toggle`);
  },
  delete: async (id) => {
    return await api.delete(`/todos/${id}`);
  }
};