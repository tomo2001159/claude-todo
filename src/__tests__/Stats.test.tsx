import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../components/Stats';

describe('Stats', () => {
  it('タスクが0件のとき達成率は0%、残りも0を表示する', () => {
    render(<Stats total={0} completed={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    // 合計・完了・残りすべて 0
    const values = screen.getAllByText('0');
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  it('半分完了したとき達成率50%を表示する', () => {
    render(<Stats total={4} completed={2} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('全タスク完了のとき達成率100%を表示する', () => {
    render(<Stats total={3} completed={3} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('端数は四捨五入して表示する（1/3 → 33%）', () => {
    render(<Stats total={3} completed={1} />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('残り件数は total - completed を正しく表示する', () => {
    render(<Stats total={7} completed={3} />);
    expect(screen.getByText('7')).toBeInTheDocument();  // 合計
    expect(screen.getByText('3')).toBeInTheDocument();  // 完了
    expect(screen.getByText('4')).toBeInTheDocument();  // 残り
  });

  it('プログレスバーの幅が達成率に応じて設定される', () => {
    const { container } = render(<Stats total={2} completed={1} />);
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('タスクが0件のときプログレスバーの幅は0%', () => {
    const { container } = render(<Stats total={0} completed={0} />);
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });
});
