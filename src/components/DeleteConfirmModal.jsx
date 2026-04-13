function DeleteConfirmModal({ transaction, onClose, onConfirm }) {
  if (!transaction) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Удалить транзакцию?</h3>

        <p className="delete-modal-text">
          <strong>{transaction.title}</strong>
        </p>

        <p className="delete-modal-subtext">
          Это действие нельзя отменить.
        </p>

        <div className="delete-modal-actions">
          <button className="delete-cancel-button" onClick={onClose}>
            Отмена
          </button>

          <button className="delete-confirm-button" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;