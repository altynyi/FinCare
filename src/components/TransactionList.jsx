function formatDate(dateString) {
  if (!dateString) return 'Без даты';

  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

function TransactionList({ transactions, onDeleteTransaction }) {
  return (
    <div className="panel">
      <h2>История транзакций</h2>

      <div className="list">
        {transactions.length === 0 ? (
          <div>Пока нет транзакций</div>
        ) : (
          transactions.map((tx) => (
            <div className="list-item" key={tx.id}>
              <div>
                <strong>{tx.title}</strong>
                <div className="meta">
                  {tx.category} • {tx.type === 'expense' ? 'Расход' : 'Доход'}
                </div>
                <div className="meta">
                  Дата: {formatDate(tx.transaction_date)}
                </div>
              </div>

              <div className="transaction-actions">
                <div className="amount">{tx.amount} сом</div>
                <button
                  className="delete-transaction-button"
                  onClick={() => onDeleteTransaction(tx.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;