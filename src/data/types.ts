import type { Lang } from '../context/LangContext';

export interface CodePair {
  bad: string;
  good: string;
}

export interface QuestionData {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeExamples: Record<Lang, CodePair>;
  principle: 'S' | 'O' | 'L' | 'I' | 'D';
}

export interface Question extends QuestionData {
  id: number;
}
