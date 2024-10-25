import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

const CATEGORIES = [
  { id: 'work', label: 'Arbeid', icon: '💼' },
  { id: 'personal', label: 'Personlig', icon: '👤' },
  { id: 'shopping', label: 'Handling', icon: '🛒' },
  { id: 'health', label: 'Helse', icon: '🏥' }
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        category: selectedCategory
      }
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = filter
    ? todos.filter(todo => todo.category === filter)
    : todos;

  const incompleteTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      <form onSubmit={addTodo} className="flex gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Legg til ny oppgave..."
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !filter
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
          }`}
        >
          Alle
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {incompleteTodos.length === 0 && completedTodos.length === 0 && (
          <div className="text-center py-8">
            <ListTodo className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Ingen oppgaver enda</p>
          </div>
        )}

        {incompleteTodos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className="w-6 h-6 border-2 rounded-full hover:border-blue-500 transition-all flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-transparent group-hover:text-blue-500" />
            </button>
            <span className="flex-1">{todo.text}</span>
            <span className="text-sm">
              {CATEGORIES.find(cat => cat.id === todo.category)?.icon}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {completedTodos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Fullført</h3>
            {completedTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group opacity-50"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="w-6 h-6 border-2 rounded-full border-blue-500 transition-all flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-blue-500" />
                </button>
                <span className="flex-1 line-through">{todo.text}</span>
                <span className="text-sm">
                  {CATEGORIES.find(cat => cat.id === todo.category)?.icon}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}