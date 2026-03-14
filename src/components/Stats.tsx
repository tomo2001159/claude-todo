interface Props {
  total: number;
  completed: number;
}

export default function Stats({ total, completed }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="stats">
      <div className="stats-row">
        <div className="stats-counts">
          <div className="stat-item">
            <span className="stat-value">{total}</span>
            <span className="stat-label">合計</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">完了</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{total - completed}</span>
            <span className="stat-label">残り</span>
          </div>
        </div>
        <span className="stats-percent">{percent}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
