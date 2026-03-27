const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-bold transition-all ${todo.status === 'COMPLETADA' ? 'text-slate-400 line-through italic' : 'text-slate-700'}`}>
            {todo.title}
          </h3>
          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-black border
            ${todo.status === 'COMPLETADA' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
            {todo.status}
          </span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-1">{todo.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onToggle(todo.id)} className="text-2xl hover:scale-125 transition-transform p-1">
          {todo.status === 'COMPLETADA' ? '↩️' : '✅'}
        </button>
        <button onClick={() => onDelete(todo.id)} className="text-lg hover:scale-125 transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;