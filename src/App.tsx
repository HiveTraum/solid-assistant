import { useState, useMemo } from 'react';
import { questions } from './data/questions';
import type { Question } from './data/questions';
import { LangProvider } from './context/LangContext';
import { LangSwitcher } from './components/LangSwitcher';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { ChecklistScreen } from './components/ChecklistScreen';
import './App.css';

type Screen = 'start' | 'quiz' | 'result' | 'checklist';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  const totalAvailable = questions.length;

  const handleStart = (count: number) => {
    const shuffled = shuffle(questions).slice(0, count);
    setQuizQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setScreen('quiz');
  };

  const handleAnswer = (correct: boolean) => {
    const newScore = correct ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen('result');
    }
  };

  return (
    <LangProvider>
      <div className="app">
        <header className="app-header">
          <LangSwitcher />
        </header>
        {screen === 'start' && (
          <StartScreen
            totalQuestions={totalAvailable}
            onStart={handleStart}
            onChecklist={() => setScreen('checklist')}
          />
        )}
        {screen === 'quiz' && quizQuestions.length > 0 && (
          <QuizScreen
            question={quizQuestions[currentQuestion]}
            current={currentQuestion}
            total={quizQuestions.length}
            score={score}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            score={score}
            total={quizQuestions.length}
            onRestart={() => setScreen('start')}
          />
        )}
        {screen === 'checklist' && (
          <ChecklistScreen onBack={() => setScreen('start')} />
        )}
      </div>
    </LangProvider>
  );
}

export default App;
