interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);

  const getResult = () => {
    if (percentage >= 90) return { title: 'Отлично!', message: 'Ты отлично знаешь SOLID!' };
    if (percentage >= 70) return { title: 'Хорошо!', message: 'Неплохое понимание, но есть куда расти.' };
    if (percentage >= 50) return { title: 'Нормально', message: 'Стоит повторить некоторые принципы.' };
    return { title: 'Нужно подучить', message: 'Рекомендуем перечитать материалы по SOLID.' };
  };

  const { title, message } = getResult();

  return (
    <div className="screen result-screen">
      <h1>{title}</h1>
      <div className="result-score">
        <span className="score-number">{score}</span>
        <span className="score-divider">/</span>
        <span className="score-total">{total}</span>
      </div>
      <p className="result-percentage">{percentage}%</p>
      <p className="result-message">{message}</p>
      <button className="btn btn-primary" onClick={onRestart}>
        Пройти заново
      </button>
    </div>
  );
}
