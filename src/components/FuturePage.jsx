import { useRef, useState } from 'react';

function formatMoney(value) {
  return Number(value || 0).toLocaleString('ru-RU');
}

function createGoalCard(title) {
  return {
    id: Date.now() + Math.random(),
    title,
    goal: 1000,
    current: 0,
    inputAmount: '',
    imageUrl: '',
    sparks: [],
    touched: false,
  };
}

function isUntouchedGoal(card) {
  return (
    !card.touched &&
    !card.imageUrl &&
    Number(card.current) === 0 &&
    Number(card.goal) === 1000 &&
    !card.inputAmount
  );
}

function FuturePage() {
  const [goalCards, setGoalCards] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const fileInputRefs = useRef({});

  const selectedGoal =
    goalCards.find((card) => card.id === selectedGoalId) || null;

  const updateCard = (id, updater) => {
    setGoalCards((prev) =>
      prev.map((card) => (card.id === id ? updater(card) : card))
    );
  };

  const cleanupUntouchedGoals = (keepId = null) => {
    setGoalCards((prev) =>
      prev.filter((card) => card.id === keepId || !isUntouchedGoal(card))
    );
  };

  const createSparkles = (id) => {
    const next = Array.from({ length: 18 }).map((_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 110;
      return {
        id: `${Date.now()}-${index}`,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 120,
      };
    });

    updateCard(id, (card) => ({ ...card, sparks: next, touched: true }));

    window.setTimeout(() => {
      updateCard(id, (card) => ({ ...card, sparks: [] }));
    }, 1100);
  };

  const handleAddGoalCard = () => {
    cleanupUntouchedGoals();

    const title = window.prompt('Введите название цели:');
    if (!title || !title.trim()) {
      return;
    }

    const newGoal = createGoalCard(title.trim());

    setGoalCards((prev) => [...prev, newGoal]);
    setSelectedGoalId(newGoal.id);
  };

  const handleSelectGoal = (id) => {
    cleanupUntouchedGoals(id);
    setSelectedGoalId(id);
  };

  const handleImageChange = (id, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    updateCard(id, (card) => ({
      ...card,
      imageUrl: url,
      touched: true,
    }));
  };

  const handleAddMoney = (id) => {
    const card = goalCards.find((item) => item.id === id);
    if (!card) return;

    const amount = Number(card.inputAmount);
    if (!amount || amount <= 0) return;

    updateCard(id, (prev) => ({
      ...prev,
      current: prev.current + amount,
      inputAmount: '',
      touched: true,
    }));

    createSparkles(id);
  };

  const handleReset = (id) => {
    const confirmed = window.confirm('Очистить прогресс накоплений?');
    if (!confirmed) return;

    updateCard(id, (card) => ({
      ...card,
      current: 0,
      inputAmount: '',
      touched: true,
    }));
  };

  const handleSetGoal = (id) => {
    const card = goalCards.find((item) => item.id === id);
    if (!card) return;

    const value = window.prompt('Введите сумму цели:', String(card.goal));
    if (!value) return;

    const parsed = Number(value);
    if (!parsed || parsed <= 0) return;

    updateCard(id, (prev) => ({
      ...prev,
      goal: parsed,
      touched: true,
    }));
  };

  const handleSetCurrent = (id) => {
    const card = goalCards.find((item) => item.id === id);
    if (!card) return;

    const value = window.prompt('Установить текущую сумму:', String(card.current));
    if (!value) return;

    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return;

    updateCard(id, (prev) => ({
      ...prev,
      current: parsed,
      touched: true,
    }));
  };

  const handleSetTitle = (id) => {
    const card = goalCards.find((item) => item.id === id);
    if (!card) return;

    const value = window.prompt('Введите название цели:', card.title);
    if (!value || !value.trim()) return;

    updateCard(id, (prev) => ({
      ...prev,
      title: value.trim(),
      touched: true,
    }));
  };

  const handleDeleteGoal = (id) => {
    const confirmed = window.confirm('Удалить эту цель?');
    if (!confirmed) return;

    setGoalCards((prev) => {
      const updated = prev.filter((card) => card.id !== id);

      if (updated.length === 0) {
        setSelectedGoalId(null);
        return [];
      }

      if (selectedGoalId === id) {
        setSelectedGoalId(updated[0].id);
      }

      return updated;
    });
  };

  return (
    <div className="future-goals-page">
      <div className="future-goals-toolbar">
        <button className="future-add-goal-button" onClick={handleAddGoalCard}>
          +
        </button>
      </div>

      <div className="goals-list-panel">
        <div className="goals-list-title">Мои цели</div>

        <div className="goals-list">
          {goalCards.length === 0 ? (
            <div className="empty-block">Пока нет целей. Нажмите +, чтобы добавить новую.</div>
          ) : (
            goalCards.map((card) => (
              <button
                key={card.id}
                className={
                  selectedGoalId === card.id ? 'goal-chip active' : 'goal-chip'
                }
                onClick={() => handleSelectGoal(card.id)}
              >
                <span>{card.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedGoal && (
        <div className="future-goal-item">
          <input
            ref={(el) => {
              fileInputRefs.current[selectedGoal.id] = el;
            }}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleImageChange(selectedGoal.id, e)}
          />

          {(() => {
            const ratio =
              selectedGoal.goal > 0
                ? Math.min(selectedGoal.current / selectedGoal.goal, 1)
                : 0;
            const degrees = ratio * 360;
            const circumference = 2 * Math.PI * 48;
            const dashOffset = circumference - ratio * circumference;
            const left = Math.max(0, selectedGoal.goal - selectedGoal.current);

            const maskStyle = {
              WebkitMaskImage: `conic-gradient(black 0deg, black ${degrees}deg, transparent ${degrees}deg)`,
              maskImage: `conic-gradient(black 0deg, black ${degrees}deg, transparent ${degrees}deg)`,
            };

            return (
              <>
                <div className="selected-goal-header">
                  <h2>{selectedGoal.title}</h2>

                  <div className="selected-goal-actions">
                    <button
                      className="goal-title-edit-button"
                      onClick={() => handleSetTitle(selectedGoal.id)}
                    >
                      Изменить название
                    </button>

                    <button
                      className="goal-delete-button"
                      onClick={() => handleDeleteGoal(selectedGoal.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div
                  className="goal-photo-circle"
                  onClick={() => fileInputRefs.current[selectedGoal.id]?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRefs.current[selectedGoal.id]?.click();
                    }
                  }}
                >
                  {!selectedGoal.imageUrl ? (
                    <div className="goal-photo-placeholder">
                      <span className="goal-photo-plus">+</span>
                      <span className="goal-photo-text">Добавить фото</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={selectedGoal.imageUrl}
                        alt="Цель накопления"
                        className="goal-photo-blurred"
                      />
                      <img
                        src={selectedGoal.imageUrl}
                        alt="Цель накопления"
                        className="goal-photo-clear"
                        style={maskStyle}
                      />
                    </>
                  )}

                  <svg className="goal-ring-overlay" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="#05c851"
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {selectedGoal.sparks.map((spark) => (
                    <span
                      key={spark.id}
                      className="goal-spark"
                      style={{
                        '--spark-x': `${spark.x}px`,
                        '--spark-y': `${spark.y}px`,
                        '--spark-size': `${spark.size}px`,
                        '--spark-delay': `${spark.delay}ms`,
                      }}
                    />
                  ))}
                </div>

                <div className="future-goal-card">
                  <div className="goal-stat-row">
                    <span>
                      Цель: <b>{formatMoney(selectedGoal.goal)} ₽</b>
                    </span>
                    <button
                      type="button"
                      className="goal-edit-link"
                      onClick={() => handleSetGoal(selectedGoal.id)}
                    >
                      Изменить
                    </button>
                  </div>

                  <div className="goal-stat-row">
                    <span>
                      Внесено: <b>{formatMoney(selectedGoal.current)} ₽</b>
                    </span>
                    <button
                      type="button"
                      className="goal-edit-link"
                      onClick={() => handleSetCurrent(selectedGoal.id)}
                    >
                      Изменить
                    </button>
                  </div>

                  <div className="goal-stat-row goal-stat-muted">
                    <span>Осталось: {formatMoney(left)} ₽</span>
                  </div>

                  <input
                    type="number"
                    className="goal-amount-input"
                    placeholder="Сумма пополнения..."
                    value={selectedGoal.inputAmount}
                    onChange={(e) =>
                      updateCard(selectedGoal.id, (prev) => ({
                        ...prev,
                        inputAmount: e.target.value,
                        touched: true,
                      }))
                    }
                  />

                  <div className="goal-controls">
                    <button
                      type="button"
                      className="goal-btn-add"
                      onClick={() => handleAddMoney(selectedGoal.id)}
                    >
                      Внести
                    </button>
                    <button
                      type="button"
                      className="goal-btn-reset"
                      onClick={() => handleReset(selectedGoal.id)}
                    >
                      Сброс
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default FuturePage;