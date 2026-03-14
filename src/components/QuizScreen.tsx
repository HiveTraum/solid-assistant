import { useState } from 'react';
import type { Question } from '../data/questions';
import { CodeBlock } from './CodeBlock';

interface QuizScreenProps {
  question: Question;
  current: number;
  total: number;
  score: number;
  onAnswer: (correct: boolean) => void;
}

export function QuizScreen({ question, current, total, score, onAnswer }: QuizScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
  };

  const handleNext = () => {
    if (selected === null) return;
    onAnswer(selected === question.correctIndex);
    setSelected(null);
    setAnswered(false);
  };

  const getOptionClass = (index: number) => {
    if (!answered) return selected === index ? 'option selected' : 'option';
    if (index === question.correctIndex) return 'option correct';
    if (index === selected) return 'option wrong';
    return 'option';
  };

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="screen quiz-screen">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="quiz-header">
        <span className="counter">
          Вопрос {current + 1} / {total}
        </span>
        <span className="principle-badge" data-principle={question.principle}>
          {question.principle}
        </span>
        <span className="score">
          {score} из {current} правильно
        </span>
      </div>

      <h2 className="question-text">{question.text}</h2>

      <div className="options">
        {question.options.map((option, i) => (
          <button key={i} className={getOptionClass(i)} onClick={() => handleSelect(i)}>
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div className={`explanation ${selected === question.correctIndex ? 'correct' : 'wrong'}`}>
          <p>{question.explanation}</p>
          <CodeBlock codeExamples={question.codeExamples} />
        </div>
      )}

      <button className="btn btn-primary" disabled={!answered} onClick={handleNext}>
        {current + 1 < total ? 'Следующий вопрос' : 'Результаты'}
      </button>
    </div>
  );
}
