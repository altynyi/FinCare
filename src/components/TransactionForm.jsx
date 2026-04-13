import { useState } from 'react';

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function TransactionForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Еда');
  const [transactionDate, setTransactionDate] = useState(getTodayDate());

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit({
      title,
      amount: Number(amount),
      type,
      category,
      transaction_date: transactionDate
    });

    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('Еда');
    setTransactionDate(getTodayDate());
  };

  return (
    <div className="panel">
      <h2>Добавить транзакцию</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Например: Burger King"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Еда">Еда</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Образование">Образование</option>
          <option value="Другое">Другое</option>
        </select>

        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;