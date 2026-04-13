function Achievements({ transactions, stats }) {
  const totalTransactions = transactions.length;
  const totalExpense = stats?.totalExpense ?? 0;
  const totalIncome = stats?.totalIncome ?? 0;

  const achievements = [
    {
      title: 'Первая транзакция',
      description: 'Вы сделали первый шаг к контролю своих финансов.',
      unlocked: totalTransactions >= 1
    },
    {
      title: 'Финансовый старт',
      description: 'Добавлено не менее 3 транзакций.',
      unlocked: totalTransactions >= 3
    },
    {
      title: 'Активный пользователь',
      description: 'Добавлено не менее 5 транзакций.',
      unlocked: totalTransactions >= 5
    },
    {
      title: 'Первые 100 сом под контролем',
      description: 'Общая сумма расходов достигла 100 сом и выше.',
      unlocked: totalExpense >= 100
    },
    {
      title: 'Есть доход',
      description: 'Вы добавили хотя бы один доход.',
      unlocked: totalIncome > 0
    },
    {
      title: 'Осознанные траты',
      description: 'У вас расходов больше 0 и система уже может анализировать бюджет.',
      unlocked: totalExpense > 0
    }
  ];

  return (
    <div className="panel">
      <h2>Достижения</h2>
      <div className="achievements-grid">
        {achievements.map((item) => (
          <div
            key={item.title}
            className={`achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-status">
              {item.unlocked ? '🏆 Открыто' : '🔒 Закрыто'}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;