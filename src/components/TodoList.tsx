import { AnimatePresence, motion } from 'framer-motion';
import type { Todo, Filter } from '../types';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter: Filter;
}

export default function TodoList({ todos, onToggle, onDelete, filter }: Props) {
  if (todos.length === 0) {
    return (
      <motion.div
        key={`empty-${filter}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyState filter={filter} />
      </motion.div>
    );
  }

  return (
    <div className="todo-list">
      <AnimatePresence initial={false}>
        {todos.map((todo, i) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: i * 0.03,
            }}
            layout
          >
            <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
