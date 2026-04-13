function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} с`;
}

function formatDateLabel(dateString) {
  if (!dateString) return 'Без даты';

  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}

function groupTransactionsByDate(transactions = []) {
  const grouped = {};

  transactions.forEach((tx) => {
    const key = tx.transaction_date || 'Без даты';

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(tx);
  });

  return Object.entries(grouped).sort((a, b) => {
    if (a[0] === 'Без даты') return 1;
    if (b[0] === 'Без даты') return -1;
    return new Date(b[0]) - new Date(a[0]);
  });
}

function HistoryByDate({ transactions = [], onAskDeleteTransaction }) {
  const grouped = groupTransactionsByDate(transactions);

  return (
    <div className="history-section">
      <h2 className="history-title">История</h2>

      {grouped.length === 0 ? (
        <div className="history-card">Пока нет транзакций</div>
      ) : (
        grouped.map(([date, items]) => {
          const total = items.reduce(
            (sum, item) => sum + Number(item.amount),
            0
          );

          return (
            <div className="history-card" key={date}>
              <div className="history-card-header">
                <div className="history-date">{formatDateLabel(date)}</div>
                <div className="history-day-total">{formatMoney(total)}</div>
              </div>

              <div className="history-items">
                {items.map((tx) => (
                  <div className="history-item" key={tx.id}>
                    <div className="history-item-main">
                      <div className="history-item-row">
                        <div className="history-item-category">
                          {tx.category}
                        </div>
                        <div className="history-item-dots" />
                        <div className="history-item-amount">
                          {formatMoney(tx.amount)}
                        </div>
                      </div>

                      <div className="history-item-subtitle">{tx.title}</div>
                    </div>

                    <button
                      className="history-delete-button"
                      onClick={() => onAskDeleteTransaction(tx)}
                      title="Удалить"
                      aria-label="Удалить"
                      type="button"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default HistoryByDate;