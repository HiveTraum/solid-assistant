import { useState } from 'react';
import type { CodePair } from '../data/questions';
import { useLang } from '../context/LangContext';
import type { Lang } from '../context/LangContext';

interface CodeBlockProps {
  codeExamples: Record<Lang, CodePair>;
}

export function CodeBlock({ codeExamples }: CodeBlockProps) {
  const { lang } = useLang();
  const [tab, setTab] = useState<'bad' | 'good'>('bad');
  const pair = codeExamples[lang];

  return (
    <div className="code-block">
      <div className="code-tabs">
        <button
          className={`code-tab ${tab === 'bad' ? 'active bad' : ''}`}
          onClick={() => setTab('bad')}
        >
          Неправильно
        </button>
        <button
          className={`code-tab ${tab === 'good' ? 'active good' : ''}`}
          onClick={() => setTab('good')}
        >
          Правильно
        </button>
      </div>
      <pre className="code-content">
        <code>{tab === 'bad' ? pair.bad : pair.good}</code>
      </pre>
    </div>
  );
}
