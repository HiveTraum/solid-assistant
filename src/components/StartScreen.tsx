import { useState } from 'react';

interface StartScreenProps {
  totalQuestions: number;
  onStart: (count: number) => void;
  onChecklist: () => void;
}

const PRESETS = [10, 20, 50];

export function StartScreen({ totalQuestions, onStart, onChecklist }: StartScreenProps) {
  const [count, setCount] = useState(10);

  return (
    <div className="screen start-screen">
      <h1>SOLID Quiz</h1>
      <p className="subtitle">Проверь своё знание принципов SOLID</p>
      <div className="principles">
        <span className="badge">S — Single Responsibility</span>
        <span className="badge">O — Open/Closed</span>
        <span className="badge">L — Liskov Substitution</span>
        <span className="badge">I — Interface Segregation</span>
        <span className="badge">D — Dependency Inversion</span>
      </div>

      <div className="start-actions">
        <div className="start-card quiz-card">
          <span className="start-card-icon">?</span>
          <h3>Квиз</h3>
          <p>Случайные вопросы с примерами кода и объяснениями</p>
          <div className="count-selector">
            {PRESETS.map((n) => (
              <button
                key={n}
                className={`count-btn ${count === n ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCount(n); }}
              >
                {n}
              </button>
            ))}
            <button
              className={`count-btn ${count === totalQuestions ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setCount(totalQuestions); }}
            >
              Все {totalQuestions}
            </button>
          </div>
          <button className="btn btn-primary btn-start" onClick={() => onStart(count)}>
            Начать
          </button>
        </div>
        <div className="start-card" onClick={onChecklist}>
          <span className="start-card-icon">&#10003;</span>
          <h3>Чеклист слоёв</h3>
          <p>Use Case, Adapter, Infrastructure — определи слой по признакам</p>
        </div>
      </div>
    </div>
  );
}
