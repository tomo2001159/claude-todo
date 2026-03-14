import type { Filter } from '../types';

interface Props {
  filter: Filter;
  setFilter: (f: Filter) => void;
  counts: { all: number; active: number; completed: number };
  onClearCompleted: () => void;
}

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
];

export default function FilterBar({ filter, setFilter, counts, onClearCompleted }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`filter-tab ${filter === tab.value ? 'active' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
            <span className="count">{counts[tab.value]}</span>
          </button>
        ))}
      </div>

      {counts.completed > 0 && (
        <button className="btn-clear" onClick={onClearCompleted}>
          完了済みを削除
        </button>
      )}
    </div>
  );
}
