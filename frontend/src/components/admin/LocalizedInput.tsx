import { LocalizedString } from '../../types';

interface Props {
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  label?: string;
}

export default function LocalizedInput({ value, onChange, multiline, label }: Props) {
  const langs = [
    { key: 'tr' as const, label: 'Türkçe' },
    { key: 'en' as const, label: 'English' },
    { key: 'fr' as const, label: 'Français' },
  ];

  return (
    <div className="localized-input">
      {label && <label className="form-label">{label}</label>}
      {langs.map((lang) => (
        <div key={lang.key} className="localized-field">
          <span className="lang-tag">{lang.label}</span>
          {multiline ? (
            <textarea
              value={value[lang.key]}
              onChange={(e) => onChange({ ...value, [lang.key]: e.target.value })}
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={value[lang.key]}
              onChange={(e) => onChange({ ...value, [lang.key]: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
