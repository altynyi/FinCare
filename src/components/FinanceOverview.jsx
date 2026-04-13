function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} с`;
}

function FinanceOverview({ transactions = [], activeTab, onChangeTab }) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncome = incomeTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = totalIncome - totalExpense;

  let total = 0;
  let groupedSource = [];
  let emptyText = '';

  if (activeTab === 'expense') {
    total = totalExpense;
    groupedSource = expenseTransactions;
    emptyText = 'Пока нет расходов по категориям.';
  } else if (activeTab === 'income') {
    total = totalIncome;
    groupedSource = incomeTransactions;
    emptyText = 'Пока нет доходов по категориям.';
  } else {
    total = balance;
  }

  const grouped = groupedSource.reduce((acc, item) => {
    const category = item.category || 'Прочее';
    acc[category] = (acc[category] || 0) + Number(item.amount);
    return acc;
  }, {});

  const categoryRows = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className="overview-wrapper">
      <div className="top-tabs">
        <button
          className={activeTab === 'expense' ? 'top-tab active' : 'top-tab'}
          onClick={() => onChangeTab('expense')}
        >
          Расходы
        </button>

        <button
          className={activeTab === 'income' ? 'top-tab active' : 'top-tab'}
          onClick={() => onChangeTab('income')}
        >
          Доходы
        </button>

        <button
          className={activeTab === 'accounts' ? 'top-tab active' : 'top-tab'}
          onClick={() => onChangeTab('accounts')}
        >
          Счета
        </button>
      </div>

      <div className="overview-period-row">
        <div className="overview-period">1 апр. - 30 апр.</div>
        <div className="overview-total">
          Итого: {formatMoney(total)}
        </div>
      </div>

      <div className="overview-card">
        {activeTab === 'accounts' ? (
          <div className="accounts-summary">
            <div className="accounts-balance-label">Текущий баланс</div>
            <div className="accounts-balance-value">{formatMoney(balance)}</div>
            <div className="accounts-balance-note">
              Баланс рассчитывается как разница между всеми доходами и расходами.
            </div>
          </div>
        ) : categoryRows.length === 0 ? (
          <div className="empty-block">{emptyText}</div>
        ) : (
          <div className="category-list">
            {categoryRows.map(([category, amount]) => (
              <div className="category-row" key={category}>
                <div className="category-name">{category}</div>
                <div className="category-dots" />
                <div className="category-amount">{formatMoney(amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FinanceOverview;