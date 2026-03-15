import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
  it('"Todo" タイトルが表示される', () => {
    render(<Header onToggleForm={vi.fn()} showForm={false} />);
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('showForm=false のとき「新しいタスク」ボタンを表示する', () => {
    render(<Header onToggleForm={vi.fn()} showForm={false} />);
    expect(screen.getByRole('button', { name: /新しいタスク/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /キャンセル/ })).not.toBeInTheDocument();
  });

  it('showForm=true のとき「キャンセル」ボタンを表示する', () => {
    render(<Header onToggleForm={vi.fn()} showForm={true} />);
    expect(screen.getByRole('button', { name: /キャンセル/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /新しいタスク/ })).not.toBeInTheDocument();
  });

  it('ボタンクリックで onToggleForm が呼ばれる', () => {
    const onToggleForm = vi.fn();
    render(<Header onToggleForm={onToggleForm} showForm={false} />);
    fireEvent.click(screen.getByRole('button', { name: /新しいタスク/ }));
    expect(onToggleForm).toHaveBeenCalledOnce();
  });

  it('showForm=true のときボタンに active クラスが付く', () => {
    render(<Header onToggleForm={vi.fn()} showForm={true} />);
    expect(screen.getByRole('button', { name: /キャンセル/ })).toHaveClass('active');
  });
});
