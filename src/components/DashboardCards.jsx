function DashboardCards({ stats }) {
  return (
    <div className="cards">
      <div className="card">
        <p>Доходы</p>
        <h2>{stats?.totalIncome ?? 0} сом</h2>
      </div>

      <div className="card">
        <p>Расходы</p>
        <h2>{stats?.totalExpense ?? 0} сом</h2>
      </div>

      <div className="card">
        <p>Баланс</p>
        <h2>{stats?.balance ?? 0} сом</h2>
      </div>
    </div>
  );
}

export default DashboardCards;