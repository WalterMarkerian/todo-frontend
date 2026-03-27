import { useState, useEffect } from 'react';
import { todoService } from '../api/todoService';

export const useTodos = (token, handleLogout) => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await todoService.getAll(currentPage, 5);
      setTodos(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [currentPage, token]);

  const addTodo = async (title, description) => {
    try {
      await todoService.create(title, description);
      currentPage === 0 ? loadTodos() : setCurrentPage(0);
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const toggleTodo = async (id) => {
    try {
      await todoService.toggle(id);
      await loadTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("¿Eliminar tarea?")) return;
    try {
      await todoService.delete(id);
      await loadTodos();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return {
    todos,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo
  };
};