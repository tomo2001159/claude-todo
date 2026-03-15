import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodoForm from '../components/AddTodoForm';

describe('AddTodoForm', () => {
  it('初期状態では「追加」ボタンが disabled である', () => {
    render(<AddTodoForm onAdd={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled();
  });

  it('タイトルを入力すると「追加」ボタンが有効になる', async () => {
    const user = userEvent.setup();
    render(<AddTodoForm onAdd={vi.fn()} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), 'テストタスク');
    expect(screen.getByRole('button', { name: '追加' })).toBeEnabled();
  });

  it('空白のみのタイトルでは onAdd が呼ばれない', async () => {
    const onAdd = vi.fn();
    const { container } = render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), '   ');
    fireEvent.submit(container.querySelector('form')!);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('タイトルのみで送信すると title が trim され、description は undefined になる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), '  買い物  ');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: '買い物', description: undefined }),
    );
  });

  it('タイトルと説明を入力して送信すると両方が onAdd に渡される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), '会議の準備');
    await user.type(screen.getByPlaceholderText('説明（任意）'), '資料を印刷する');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: '会議の準備', description: '資料を印刷する' }),
    );
  });

  it('デフォルトの優先度は medium である', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), 'タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ priority: 'medium' }));
  });

  it('優先度「高」を選択して送信すると priority: "high" が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const { container } = render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    fireEvent.click(container.querySelector('[data-priority="high"]')!);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), '緊急タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }));
  });

  it('優先度ボタンをクリックすると active クラスが付き替わる', () => {
    const { container } = render(<AddTodoForm onAdd={vi.fn()} onClose={vi.fn()} />);
    const highBtn = container.querySelector('[data-priority="high"]')!;
    const medBtn = container.querySelector('[data-priority="medium"]')!;

    expect(medBtn).toHaveClass('active');
    fireEvent.click(highBtn);
    expect(highBtn).toHaveClass('active');
    expect(medBtn).not.toHaveClass('active');
  });

  it('カテゴリを「仕事」に変更して送信すると category: "work" が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    await user.selectOptions(screen.getByRole('combobox'), 'work');
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), '仕事タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ category: 'work' }));
  });

  it('期日を入力して送信すると dueDate が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const { container } = render(<AddTodoForm onAdd={onAdd} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('タスクのタイトル...'), 'タスク');
    const dateInput = container.querySelector('input[type="date"]')!;
    fireEvent.change(dateInput, { target: { value: '2026-04-01' } });
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '2026-04-01' }));
  });

  it('Escape キーで onClose が呼ばれる', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddTodoForm onAdd={vi.fn()} onClose={onClose} />);
    await user.click(screen.getByPlaceholderText('タスクのタイトル...'));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});
