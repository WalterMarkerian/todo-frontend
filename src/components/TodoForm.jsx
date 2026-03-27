import { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-8">
      <input
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="¿Qué tenés pendiente?"
        required
      />
      <textarea
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)..."
        rows="2"
      />
      <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
        + Añadir Tarea
      </button>
    </form>
  );
};

export default TodoForm;