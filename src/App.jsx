import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const API_URL = "http://192.168.1.23:8090/api/v1/todos";

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      // Spring Pageable devuelve la lista en 'content'
      setTodos(response.data.content || []);
    } catch (error) {
      console.error("Error GET:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // El nombre del campo 'title' debe ser igual al del TodoDto.java
      await axios.post(API_URL, {
        title: title,
        completed: false
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setTitle("");
      fetchTodos();
    } catch (error) {
      // Si entra acá con 500, el log de la API en Ubuntu dirá la razón exacta
      console.error("Error POST 500:", error.response?.data);
      alert("Error 500 en el servidor. Revisá los logs de Docker.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Todo List Prod</h1>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
          <input 
            className="flex-1 border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué sigue?"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>
        <div className="space-y-2">
          {todos.map(t => (
            <div key={t.id} className="p-3 bg-slate-50 border rounded flex justify-between">
              {t.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;