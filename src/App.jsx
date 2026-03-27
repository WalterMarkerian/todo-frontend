import { useState } from 'react';
import { authService } from './api/authService';
import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authData, setAuthData] = useState({ username: '', password: '' });

  // Inyectamos el comportamiento mediante el Hook
  const { 
    todos, currentPage, setCurrentPage, totalPages, 
    addTodo, toggleTodo, deleteTodo, loading 
  } = useTodos(token, () => handleLogout());

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(authData.username, authData.password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) { alert("Error en login"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Todo App</h2>
          <input type="text" placeholder="Usuario" className="w-full border p-2 mb-4 rounded outline-none focus:ring-2 focus:ring-blue-400" 
            onChange={(e) => setAuthData({ ...authData, username: e.target.value })} required />
          <input type="password" placeholder="Contraseña" className="w-full border p-2 mb-6 rounded outline-none focus:ring-2 focus:ring-blue-400" 
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })} required />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl relative">
        <button onClick={handleLogout} className="absolute top-4 right-4 text-xs text-red-500 font-bold hover:bg-red-50 p-1 px-2 rounded">Cerrar Sesión</button>
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Mis Tareas</h1>

        <TodoForm onAdd={addTodo} />

        <div className="space-y-3 min-h-[350px]">
          {loading ? (
            <p className="text-center text-slate-400 mt-10 animate-pulse">Cargando tareas...</p>
          ) : (
            todos.map(t => <TodoItem key={t.id} todo={t} onToggle={toggleTodo} onDelete={deleteTodo} />)
          )}
        </div>

        {/* PAGINACIÓN */}
        <div className="mt-8 flex justify-between items-center border-t pt-4">
          <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="px-4 py-1 bg-slate-100 rounded-lg disabled:opacity-30 text-xs font-bold hover:bg-slate-200 transition">Anterior</button>
          <span className="text-xs text-slate-400 font-medium italic">Página {currentPage + 1} de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages - 1} className="px-4 py-1 bg-slate-100 rounded-lg disabled:opacity-30 text-xs font-bold hover:bg-slate-200 transition">Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default App;