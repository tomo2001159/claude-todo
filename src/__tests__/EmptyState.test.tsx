import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../components/EmptyState';

describe('EmptyState', () => {
  it('filter="all" のとき「タスクがありません」と追加を促す説明を表示する', () => {
    render(<EmptyState filter="all" />);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('「新しいタスク」から追加してみましょう')).toBeInTheDocument();
  });

  it('filter="active" のとき「未完了のタスクはありません」と全完了を示す説明を表示する', () => {
    render(<EmptyState filter="active" />);
    expect(screen.getByText('未完了のタスクはありません')).toBeInTheDocument();
    expect(screen.getByText('すべてのタスクが完了しています！')).toBeInTheDocument();
  });

  it('filter="completed" のとき「完了済みのタスクはありません」と誘導説明を表示する', () => {
    render(<EmptyState filter="completed" />);
    expect(screen.getByText('完了済みのタスクはありません')).toBeInTheDocument();
    expect(screen.getByText('タスクを完了するとここに表示されます')).toBeInTheDocument();
  });

  it('各フィルターで異なるテキストが表示される（相互に混在しない）', () => {
    const { rerender } = render(<EmptyState filter="all" />);
    expect(screen.queryByText('未完了のタスクはありません')).not.toBeInTheDocument();

    rerender(<EmptyState filter="active" />);
    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument();
  });
});
