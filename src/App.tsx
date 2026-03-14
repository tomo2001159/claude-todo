import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Todo, Filter } from './types';
import Header from './components/Header';
import Stats from './components/Stats';
import AddTodoForm from './components/AddTodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';

const STORAGE_KEY = 'todos-v1';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState<Filter>('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (data: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setShowForm(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Header
            onToggleForm={() => setShowForm(v => !v)}
            showForm={showForm}
          />
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="form-wrapper"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <AddTodoForm onAdd={addTodo} onClose={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stats total={todos.length} completed={completedCount} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            counts={{ all: todos.length, active: activeCount, completed: completedCount }}
            onClearCompleted={clearCompleted}
          />
        </motion.div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          filter={filter}
        />
      </div>
    </div>
  );
}
