function AIAdvice({ summary }) {
  return (
    <div className="panel">
      <h2>AI-анализ</h2>
      <p>{summary || 'Загрузка анализа...'}</p>
    </div>
  );
}

export default AIAdvice;