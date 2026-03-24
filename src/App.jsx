import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const API_URL = "http://192.168.1.23:8090/api/v1/todos"; // Tu IP de San Isidro

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error conectando a la API", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    await axios.post(API_URL, { title, completed: false });
    setTitle("");
    getTodos();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Todo App - Prod</h1>
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
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
            <li key={todo.id} className="p-3 bg-gray-50 rounded border flex justify-between">
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App