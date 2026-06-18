import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = langs.find((l) => l.code === i18n.language) ?? langs[0];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('marcher_lang', code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="lang-flag">{current.flag}</span>
        <span>{current.label}</span>
        <i className={`bi bi-chevron-down lang-chevron${open ? ' open' : ''}`} />
      </button>

      {open && (
        <ul className="lang-menu" role="listbox">
          {langs.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={i18n.language === l.code}
                className={i18n.language === l.code ? 'active' : ''}
                onClick={() => changeLang(l.code)}
              >
                <span className="lang-flag">{l.flag}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
