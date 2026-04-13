import { useState } from 'react';

function RegisterPage({ onRegister }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onRegister(trimmedName);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Добро пожаловать</h1>
        <p className="register-subtitle">
          Введи своё имя, чтобы персонализировать финансового ассистента.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Например: Алтынай"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit">Начать</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;