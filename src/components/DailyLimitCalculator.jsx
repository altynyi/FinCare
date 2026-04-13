import { useState } from 'react';

function DailyLimitCalculator({ balance = 0 }) {
  const [dailyLimit, setDailyLimit] = useState('');
  const [daysResult, setDaysResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const limit = Number(dailyLimit);

    if (!limit || limit <= 0) {
      setDaysResult(null);
      setMessage('Введите корректную максимальную сумму в день.');
      return;
    }

    if (balance <= 0) {
      setDaysResult(0);
      setMessage('Текущий баланс равен нулю или отрицательный, поэтому расчет недоступен.');
      return;
    }

    const days = Math.floor(balance / limit);
    setDaysResult(days);

    if (days <= 3) {
      setMessage(
        `При лимите ${limit} сом в день текущего баланса хватит примерно на ${days} дн. Стоит сократить траты или пополнить баланс.`
      );
    } else if (days <= 7) {
      setMessage(
        `При лимите ${limit} сом в день текущего баланса хватит примерно на ${days} дн. Ситуация под контролем, но лучше быть осторожнее.`
      );
    } else {
      setMessage(
        `При лимите ${limit} сом в день текущего баланса хватит примерно на ${days} дн. Это выглядит достаточно стабильно.`
      );
    }
  };

  return (
    <div className="daily-limit-card">
      <div className="daily-limit-top">
        <input
          type="number"
          placeholder="Лимит в день"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
          onKeyDown={handleKeyDown}
          className="daily-limit-input"
        />

        <div className="daily-limit-result">
          {daysResult !== null ? `${daysResult} дн.` : '-'}
        </div>
      </div>

      <div className="daily-limit-message">
        {message || 'Введите сумму и нажмите Enter, чтобы узнать, на сколько дней хватит баланса.'}
      </div>
    </div>
  );
}

export default DailyLimitCalculator;