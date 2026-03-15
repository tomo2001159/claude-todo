import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Todo } from '../types';
import TodoItem from '../components/TodoItem';

const BASE_TODO: Todo = {
  id: 'test-id-1',
  title: 'テストタスク',
  completed: false,
  priority: 'medium',
  category: 'personal',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('TodoItem - 表示', () => {
  it('タイトルが表示される', () => {
    render(<TodoItem todo={BASE_TODO} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('説明がある場合は表示される', () => {
    const todo = { ...BASE_TODO, description: '詳細な説明文' };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('詳細な説明文')).toBeInTheDocument();
  });

  it('説明がない場合は説明欄が表示されない', () => {
    const { container } = render(<TodoItem todo={BASE_TODO} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(container.querySelector('.todo-description')).not.toBeInTheDocument();
  });

  it.each([
    ['high', '高'],
    ['medium', '中'],
    ['low', '低'],
  ] as const)('優先度 %s のとき「%s」バッジを表示する', (priority, label) => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, priority }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-priority')).toHaveTextContent(label);
  });

  it.each([
    ['work', '仕事'],
    ['personal', '個人'],
    ['shopping', '買い物'],
    ['health', '健康'],
    ['other', 'その他'],
  ] as const)('カテゴリ %s のとき「%s」バッジを表示する', (category, label) => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, category }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-category')).toHaveTextContent(label);
  });
});

describe('TodoItem - 完了状態', () => {
  it('未完了のとき completed クラスがない', () => {
    const { container } = render(<TodoItem todo={BASE_TODO} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(container.querySelector('.todo-item')).not.toHaveClass('completed');
  });

  it('完了済みのとき todo-item に completed クラスが付く', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.todo-item')).toHaveClass('completed');
  });

  it('完了済みのときチェックボックスに checked クラスが付く', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.todo-checkbox')).toHaveClass('checked');
  });
});

describe('TodoItem - インタラクション', () => {
  it('チェックボックスクリックで onToggle が todo の id を引数に呼ばれる', () => {
    const onToggle = vi.fn();
    const { container } = render(<TodoItem todo={BASE_TODO} onToggle={onToggle} onDelete={vi.fn()} />);
    fireEvent.click(container.querySelector('.todo-checkbox')!);
    expect(onToggle).toHaveBeenCalledWith('test-id-1');
  });

  it('削除ボタンクリックで onDelete が todo の id を引数に呼ばれる', () => {
    const onDelete = vi.fn();
    const { container } = render(<TodoItem todo={BASE_TODO} onToggle={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(container.querySelector('.todo-delete')!);
    expect(onDelete).toHaveBeenCalledWith('test-id-1');
  });
});

describe('TodoItem - 期日表示', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dueDate がない場合は期日バッジが表示されない', () => {
    const { container } = render(<TodoItem todo={BASE_TODO} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(container.querySelector('.badge-due')).not.toBeInTheDocument();
  });

  it('期日が今日のとき「今日」と表示され today クラスが付く', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, dueDate: '2026-03-15' }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-due')).toHaveTextContent('今日');
    expect(container.querySelector('.badge-due')).toHaveClass('today');
  });

  it('期日が明日のとき「明日」と表示される', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, dueDate: '2026-03-16' }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-due')).toHaveTextContent('明日');
  });

  it('期日が過去のとき「x日前」と表示され overdue クラスが付く', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, dueDate: '2026-03-12' }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-due')).toHaveTextContent('3日前');
    expect(container.querySelector('.badge-due')).toHaveClass('overdue');
  });

  it('期日が7日以内の未来のとき「x日後」と表示される', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, dueDate: '2026-03-19' }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-due')).toHaveTextContent('4日後');
  });

  it('期日が8日以上先のとき月日形式で表示される', () => {
    const { container } = render(
      <TodoItem todo={{ ...BASE_TODO, dueDate: '2026-03-25' }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.badge-due')).toHaveTextContent('3月25日');
  });
});
