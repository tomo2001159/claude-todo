import { useState, useRef, useEffect } from 'react';
import type { Todo, Priority, Category } from '../types';

interface Props {
  onAdd: (data: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; dot: string }[] = [
  { value: 'high', label: '高', dot: '●' },
  { value: 'medium', label: '中', dot: '●' },
  { value: 'low', label: '低', dot: '●' },
];

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'work', label: '仕事' },
  { value: 'personal', label: '個人' },
  { value: 'shopping', label: '買い物' },
  { value: 'health', label: '健康' },
  { value: 'other', label: 'その他' },
];

export default function AddTodoForm({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="form-card" onKeyDown={handleKeyDown}>
      <p className="form-title">新しいタスク</p>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="form-input"
          placeholder="タスクのタイトル..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="form-textarea"
          placeholder="説明（任意）"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="form-row">
          <div className="priority-group">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`priority-btn ${priority === opt.value ? 'active' : ''}`}
                data-priority={opt.value}
                onClick={() => setPriority(opt.value)}
              >
                {opt.dot} {opt.label}
              </button>
            ))}
          </div>

          <select
            className="category-select"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-row form-row-bottom">
          <button type="submit" className="btn-add" disabled={!title.trim()}>
            追加
          </button>
        </div>
      </form>
    </div>
  );
}
