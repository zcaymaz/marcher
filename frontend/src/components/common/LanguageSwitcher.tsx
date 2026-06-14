import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('marcher_lang', code);
  };

  return (
    <div className="lang-switcher">
      {langs.map((l) => (
        <button
          key={l.code}
          className={i18n.language === l.code ? 'active' : ''}
          onClick={() => changeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
