import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import FilterBar from '../components/FilterBar';

const defaultCounts = { all: 5, active: 3, completed: 2 };

// フィルタータブは「完了済みを削除」ボタンと区別するため .filter-tabs 内にスコープして取得する
function getTabsContainer() {
  return document.querySelector('.filter-tabs') as HTMLElement;
}

describe('FilterBar', () => {
  it('3つのフィルタータブ（すべて・未完了・完了済み）が表示される', () => {
    render(
      <FilterBar filter="all" setFilter={vi.fn()} counts={defaultCounts} onClearCompleted={vi.fn()} />,
    );
    const tabs = within(getTabsContainer());
    expect(tabs.getByRole('button', { name: /すべて/ })).toBeInTheDocument();
    expect(tabs.getByRole('button', { name: /未完了/ })).toBeInTheDocument();
    expect(tabs.getByRole('button', { name: /完了済み/ })).toBeInTheDocument();
  });

  it('現在のフィルター "all" のタブに active クラスが付く', () => {
    render(
      <FilterBar filter="all" setFilter={vi.fn()} counts={defaultCounts} onClearCompleted={vi.fn()} />,
    );
    const tabs = within(getTabsContainer());
    expect(tabs.getByRole('button', { name: /すべて/ })).toHaveClass('active');
    expect(tabs.getByRole('button', { name: /未完了/ })).not.toHaveClass('active');
  });

  it('現在のフィルター "active" のタブに active クラスが付く', () => {
    render(
      <FilterBar filter="active" setFilter={vi.fn()} counts={defaultCounts} onClearCompleted={vi.fn()} />,
    );
    const tabs = within(getTabsContainer());
    expect(tabs.getByRole('button', { name: /未完了/ })).toHaveClass('active');
    expect(tabs.getByRole('button', { name: /すべて/ })).not.toHaveClass('active');
  });

  it('タブをクリックすると setFilter が該当の値で呼ばれる', () => {
    const setFilter = vi.fn();
    render(
      <FilterBar filter="all" setFilter={setFilter} counts={defaultCounts} onClearCompleted={vi.fn()} />,
    );
    const tabs = within(getTabsContainer());
    fireEvent.click(tabs.getByRole('button', { name: /未完了/ }));
    expect(setFilter).toHaveBeenCalledWith('active');

    fireEvent.click(tabs.getByRole('button', { name: /完了済み/ }));
    expect(setFilter).toHaveBeenCalledWith('completed');
  });

  it('completed が 0 のとき「完了済みを削除」ボタンは表示されない', () => {
    render(
      <FilterBar
        filter="all"
        setFilter={vi.fn()}
        counts={{ all: 3, active: 3, completed: 0 }}
        onClearCompleted={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: '完了済みを削除' })).not.toBeInTheDocument();
  });

  it('completed > 0 のとき「完了済みを削除」ボタンが表示される', () => {
    render(
      <FilterBar filter="all" setFilter={vi.fn()} counts={defaultCounts} onClearCompleted={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeInTheDocument();
  });

  it('「完了済みを削除」クリックで onClearCompleted が呼ばれる', () => {
    const onClearCompleted = vi.fn();
    render(
      <FilterBar filter="all" setFilter={vi.fn()} counts={defaultCounts} onClearCompleted={onClearCompleted} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '完了済みを削除' }));
    expect(onClearCompleted).toHaveBeenCalledOnce();
  });

  it('各タブに対応する件数が表示される', () => {
    render(
      <FilterBar
        filter="all"
        setFilter={vi.fn()}
        counts={{ all: 8, active: 5, completed: 3 }}
        onClearCompleted={vi.fn()}
      />,
    );
    const counts = document.querySelectorAll('.count');
    const texts = Array.from(counts).map(el => el.textContent);
    expect(texts).toContain('8');
    expect(texts).toContain('5');
    expect(texts).toContain('3');
  });
});
