import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  vi.clearAllMocks();
});

// テスト用ヘルパー: フォームを開いてタスクを追加する
async function addTodo(title: string) {
  const user = userEvent.setup();
  fireEvent.click(screen.getByRole('button', { name: /新しいタスク/ }));
  await user.type(screen.getByPlaceholderText('タスクのタイトル...'), title);
  await user.click(screen.getByRole('button', { name: '追加' }));
}

// Stats の各カウント値を取得するヘルパー
function getStatValue(label: '合計' | '完了' | '残り'): string | null {
  const labelEl = Array.from(document.querySelectorAll('.stat-label')).find(
    el => el.textContent === label,
  );
  return labelEl?.previousElementSibling?.textContent ?? null;
}

describe('App - 初期表示', () => {
  it('タスクが0件のとき空状態メッセージを表示する', () => {
    render(<App />);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  it('localStorage に保存済みのタスクを初期表示に反映する', () => {
    const savedTodos = [
      {
        id: 'saved-1',
        title: '保存済みタスク',
        completed: false,
        priority: 'medium',
        category: 'personal',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem('todos-v1', JSON.stringify(savedTodos));
    render(<App />);
    expect(screen.getByText('保存済みタスク')).toBeInTheDocument();
  });
});

describe('App - タスク追加', () => {
  it('フォームからタスクを追加するとリストに表示される', async () => {
    render(<App />);
    await addTodo('ミルクを買う');
    expect(screen.getByText('ミルクを買う')).toBeInTheDocument();
  });

  it('タスクを追加するとフォームが閉じる', async () => {
    render(<App />);
    await addTodo('タスクA');
    expect(screen.queryByPlaceholderText('タスクのタイトル...')).not.toBeInTheDocument();
  });

  it('複数タスクを追加すると全て表示され、最新が先頭に来る', async () => {
    render(<App />);
    await addTodo('最初のタスク');
    await addTodo('2番目のタスク');
    const titles = document.querySelectorAll('.todo-title');
    expect(titles[0]).toHaveTextContent('2番目のタスク');
    expect(titles[1]).toHaveTextContent('最初のタスク');
  });

  it('タスクを追加すると localStorage に保存される', async () => {
    render(<App />);
    await addTodo('保存テスト');
    const stored = JSON.parse(localStorage.getItem('todos-v1') ?? '[]') as { title: string }[];
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('保存テスト');
  });

  it('タスクを追加すると Stats の合計件数が増える', async () => {
    render(<App />);
    expect(getStatValue('合計')).toBe('0');
    await addTodo('タスク');
    expect(getStatValue('合計')).toBe('1');
  });
});

describe('App - タスク完了トグル', () => {
  it('チェックボックスをクリックするとタスクが完了状態になる', async () => {
    render(<App />);
    await addTodo('完了テスト');
    fireEvent.click(document.querySelector('.todo-checkbox')!);
    await waitFor(() => {
      expect(document.querySelector('.todo-item')).toHaveClass('completed');
    });
  });

  it('完了済みタスクのチェックボックスを再クリックすると未完了に戻る', async () => {
    render(<App />);
    await addTodo('トグルテスト');
    const checkbox = document.querySelector('.todo-checkbox')!;
    fireEvent.click(checkbox);
    await waitFor(() => expect(document.querySelector('.todo-item')).toHaveClass('completed'));
    fireEvent.click(checkbox);
    await waitFor(() => expect(document.querySelector('.todo-item')).not.toHaveClass('completed'));
  });

  it('タスクを完了すると Stats の完了件数が増える', async () => {
    render(<App />);
    await addTodo('カウントテスト');
    expect(getStatValue('完了')).toBe('0');
    fireEvent.click(document.querySelector('.todo-checkbox')!);
    await waitFor(() => {
      expect(getStatValue('完了')).toBe('1');
    });
  });
});

describe('App - タスク削除', () => {
  it('削除ボタンをクリックするとタスクがリストから消える', async () => {
    render(<App />);
    await addTodo('削除対象タスク');
    expect(screen.getByText('削除対象タスク')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.todo-delete')!);
    await waitFor(() => {
      expect(screen.queryByText('削除対象タスク')).not.toBeInTheDocument();
    });
  });

  it('最後のタスクを削除すると空状態メッセージが表示される', async () => {
    render(<App />);
    await addTodo('最後のタスク');
    fireEvent.click(document.querySelector('.todo-delete')!);
    await waitFor(() => {
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });
  });
});

describe('App - フィルタリング', () => {
  // 先頭タスクを完了にするセットアップ
  async function setupWithCompletedTask() {
    await addTodo('未完了タスク');
    await addTodo('完了タスク'); // 先頭に表示される
    fireEvent.click(document.querySelectorAll('.todo-checkbox')[0]);
    await waitFor(() => expect(document.querySelector('.todo-item.completed')).toBeInTheDocument());
  }

  it('「未完了」フィルターで完了済みタスクが非表示になる', async () => {
    render(<App />);
    await setupWithCompletedTask();
    fireEvent.click(screen.getByRole('button', { name: /未完了/ }));
    await waitFor(() => {
      expect(screen.getByText('未完了タスク')).toBeInTheDocument();
      expect(screen.queryByText('完了タスク')).not.toBeInTheDocument();
    });
  });

  it('「完了済み」フィルターで未完了タスクが非表示になる', async () => {
    render(<App />);
    await setupWithCompletedTask();
    // .filter-tabs にスコープして「完了済みを削除」ボタンと区別する
    const tabsEl = document.querySelector('.filter-tabs') as HTMLElement;
    fireEvent.click(within(tabsEl).getByRole('button', { name: /完了済み/ }));
    await waitFor(() => {
      expect(screen.queryByText('未完了タスク')).not.toBeInTheDocument();
      expect(screen.getByText('完了タスク')).toBeInTheDocument();
    });
  });

  it('「すべて」フィルターに戻すと全タスクが表示される', async () => {
    render(<App />);
    await setupWithCompletedTask();
    fireEvent.click(screen.getByRole('button', { name: /未完了/ }));
    fireEvent.click(screen.getByRole('button', { name: /すべて/ }));
    await waitFor(() => {
      expect(screen.getByText('未完了タスク')).toBeInTheDocument();
      expect(screen.getByText('完了タスク')).toBeInTheDocument();
    });
  });
});

describe('App - 完了済みをまとめて削除', () => {
  it('完了タスクがないとき「完了済みを削除」ボタンが表示されない', async () => {
    render(<App />);
    await addTodo('未完了のみ');
    expect(screen.queryByRole('button', { name: '完了済みを削除' })).not.toBeInTheDocument();
  });

  it('「完了済みを削除」クリックで完了済みタスクが全て削除される', async () => {
    render(<App />);
    await addTodo('残すタスク');
    await addTodo('削除されるタスク'); // 先頭
    fireEvent.click(document.querySelectorAll('.todo-checkbox')[0]);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: '完了済みを削除' }));
    await waitFor(() => {
      expect(screen.queryByText('削除されるタスク')).not.toBeInTheDocument();
      expect(screen.getByText('残すタスク')).toBeInTheDocument();
    });
  });
});
