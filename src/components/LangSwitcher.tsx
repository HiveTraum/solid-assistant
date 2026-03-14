import { useLang, LANG_LABELS, type Lang } from '../context/LangContext';

const langs: Lang[] = ['ts', 'go', 'python'];

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switcher">
      {langs.map((l) => (
        <button
          key={l}
          className={`lang-btn ${lang === l ? 'active' : ''}`}
          onClick={() => setLang(l)}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
