import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; 

const API_URL = import.meta.env.VITE_API_URL;

  // Cada vez que currentPage cambie, se dispara el useEffect
  useEffect(() => { 
    fetchTodos(currentPage); 
  }, [currentPage]);

  const fetchTodos = async (page) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&size=${pageSize}&sort=id,desc`);
      setTodos(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(API_URL, {
        title: title,
        description: description,
        completed: false
      });
      
      setTitle("");
      setDescription("");
      
      // Volvemos a la página 0 para ver la nueva tarea arriba
      if (currentPage === 0) {
        fetchTodos(0);
      } else {
        setCurrentPage(0);
      }
    } catch (error) {
      console.error("Error al añadir:", error.response?.data || error.message);
      alert("Error al guardar.");
    }
  };

  // NUEVA FUNCIÓN PARA CAMBIAR EL ESTADO
  const handleToggleTodo = async (id) => {
    try {
      // Llamada al endpoint PATCH que definimos en el backend
      await axios.patch(`${API_URL}/${id}/toggle`);
      
      // Refrescamos la lista para ver el cambio de estado
      fetchTodos(currentPage);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo actualizar el estado de la tarea.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Gestor de Tareas</h1>
        
        <form onSubmit={handleAddTodo} className="space-y-3 mb-8">
          <input 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la tarea..."
            required
          />
          <textarea 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada..."
            rows="2"
          />
          <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition shadow-md">
            Añadir Tarea
          </button>
        </form>

        <div className="space-y-3 min-h-[400px]">
          {todos.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">No hay tareas pendientes.</p>
          ) : (
            todos.map(t => (
              <div key={t.id} className="p-4 bg-slate-50 border rounded-md shadow-sm flex justify-between items-center hover:bg-slate-100 transition">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${t.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {t.title}
                    </h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${t.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.completed ? 'Hecho' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{t.description || "Sin descripción"}</p>
                </div>

                {/* BOTÓN PARA TOGGLE */}
                <button 
                  onClick={() => handleToggleTodo(t.id)}
                  className={`p-2 rounded-full transition-all duration-300 shadow-sm ${
                    t.completed 
                      ? 'bg-slate-200 text-slate-500 hover:bg-yellow-100 hover:text-yellow-600' 
                      : 'bg-blue-100 text-blue-600 hover:bg-green-500 hover:text-white'
                  }`}
                  title={t.completed ? "Marcar como pendiente" : "Marcar como completada"}
                >
                  {t.completed ? '↩️' : '✅'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        <div className="mt-8 flex justify-between items-center border-t pt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300 transition text-sm font-semibold text-slate-700"
          >
            &laquo; Anterior
          </button>
          
          <span className="text-sm text-slate-600 font-medium">
            Página <strong>{currentPage + 1}</strong> de {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300 transition text-sm font-semibold text-slate-700"
          >
            Siguiente &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;