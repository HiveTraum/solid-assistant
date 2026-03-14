import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'ts' | 'go' | 'python';

export const LANG_LABELS: Record<Lang, string> = {
  ts: 'TypeScript',
  go: 'Go',
  python: 'Python',
};

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'ts',
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ts');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
