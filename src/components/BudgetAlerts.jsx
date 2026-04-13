function BudgetAlerts({ budget }) {
  const alerts = budget?.alerts || [];

  return (
    <div className="panel">
      <h2>Лимиты и предупреждения</h2>

      {alerts.length === 0 ? (
        <p>Пока всё под контролем. Лимиты не превышены.</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-card ${alert.status === 'exceeded' ? 'alert-danger' : 'alert-warning'}`}
            >
              <strong>{alert.category}</strong>
              <p>{alert.message}</p>
              <div className="alert-meta">
                Потрачено: {alert.spent} сом • Лимит: {alert.limit} сом
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BudgetAlerts;