import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function ResetButton({ onResetStart, onResetComplete }) {
  const handleReset = async () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить все транзакции и сбросить данные?'
    );

    if (!confirmed) {
      return;
    }

    try {
      onResetStart?.();

      await axios.delete(`${API_URL}/api/transactions/reset`);

      onResetComplete?.();
    } catch (error) {
      alert('Не удалось сбросить данные');
      console.error(error);
    }
  };

  return (
    <button className="reset-button" onClick={handleReset}>
      Сбросить данные
    </button>
  );
}

export default ResetButton;