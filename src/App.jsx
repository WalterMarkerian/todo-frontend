import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const API_URL = "http://192.168.1.23:8090/api/v1/todos";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      // OJO: Accedemos a .content porque la API devuelve un objeto Page de Spring
      setTodos(response.data.content || []); 
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // El objeto debe coincidir con los campos de tu TodoDto en Java
      await axios.post(API_URL, {
        title: title,
        completed: false
      });
      setTitle("");
      fetchTodos();
    } catch (error) {
      console.error("Error al añadir tarea:", error);
      alert("Error 500: Revisá que los nombres de los campos en el DTO de Java sean iguales a estos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Todo App - Prod</h1>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <input 
            type="text" 
            className="flex-1 border rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva tarea..."
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Añadir</button>
        </form>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="p-3 bg-gray-50 rounded border flex justify-between items-center">
              <span>{todo.title}</span>
              <span className="text-xs font-mono text-gray-400">ID: {todo.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App