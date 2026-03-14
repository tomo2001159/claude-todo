import { CheckCircle2, ListTodo, Sparkles } from 'lucide-react';
import type { Filter } from '../types';

interface Props {
  filter: Filter;
}

const STATES = {
  all: {
    icon: <Sparkles size={24} />,
    title: 'タスクがありません',
    desc: '「新しいタスク」から追加してみましょう',
  },
  active: {
    icon: <CheckCircle2 size={24} />,
    title: '未完了のタスクはありません',
    desc: 'すべてのタスクが完了しています！',
  },
  completed: {
    icon: <ListTodo size={24} />,
    title: '完了済みのタスクはありません',
    desc: 'タスクを完了するとここに表示されます',
  },
};

export default function EmptyState({ filter }: Props) {
  const state = STATES[filter];
  return (
    <div className="empty-state">
      <div className="empty-icon">{state.icon}</div>
      <p className="empty-title">{state.title}</p>
      <p className="empty-desc">{state.desc}</p>
    </div>
  );
}
