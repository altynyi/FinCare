function FinancePet({ pet, userName = 'Твой AI-Ассистент' }) {
  if (!pet) return null;

  return (
    <div className={`pet-card pet-${pet.state}`}>
      <div className="pet-avatar">{pet.avatar}</div>

      <div className="pet-content">
        <h2>{userName}</h2>
        <h3>{pet.title}</h3>
        <p>{pet.message}</p>
      </div>
    </div>
  );
}

export default FinancePet;