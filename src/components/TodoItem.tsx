import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const CATEGORY_LABEL: Record<string, string> = {
  work: '仕事',
  personal: '個人',
  shopping: '買い物',
  health: '健康',
  other: 'その他',
};

function formatDue(dateStr: string): { label: string; cls: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { label: `${Math.abs(diff)}日前`, cls: 'overdue' };
  if (diff === 0) return { label: '今日', cls: 'today' };
  if (diff === 1) return { label: '明日', cls: '' };
  if (diff <= 7) return { label: `${diff}日後`, cls: '' };
  return {
    label: due.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    cls: '',
  };
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <motion.button
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        whileTap={{ scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {todo.completed && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check size={11} strokeWidth={3} color="white" />
          </motion.span>
        )}
      </motion.button>

      <div className="todo-content">
        <p className="todo-title">{todo.title}</p>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span
            className="badge-priority"
            data-priority={todo.priority}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>

          <span className="badge-category" data-cat={todo.category}>
            {CATEGORY_LABEL[todo.category]}
          </span>

          {todo.dueDate && (() => {
            const { label, cls } = formatDue(todo.dueDate);
            return (
              <span className={`badge-due ${cls}`}>{label}</span>
            );
          })()}
        </div>
      </div>

      <motion.button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 size={14} />
      </motion.button>
    </div>
  );
}
