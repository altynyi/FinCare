import { useEffect, useState } from 'react';

function CreateGoalModal({ isOpen, onClose, onCreate }) {
  const [goalTitle, setGoalTitle] = useState('');

  useEffect(() => {
    if (isOpen) setGoalTitle('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = goalTitle.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal modern-delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modern-delete-title">Новая цель</h3>

        <div className="modern-delete-name">Введите название цели</div>

        <p className="modern-delete-subtext">
          Например: Новый телефон, Ноутбук, Поездка
        </p>

        <input
          type="text"
          className="goal-create-input"
          placeholder="Название цели"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          autoFocus
        />

        <div className="modern-delete-actions">
          <button
            className="modern-cancel-button"
            onClick={onClose}
            type="button"
          >
            Отмена
          </button>

          <button
            className="modern-confirm-button"
            onClick={handleSubmit}
            type="button"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGoalModal;