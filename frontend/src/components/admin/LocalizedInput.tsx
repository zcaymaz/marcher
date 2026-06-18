import { useState } from 'react';
import { LocalizedString } from '../../types';

interface Props {
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  label?: string;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
}

const langs = [
  { key: 'tr' as const, label: 'TR', full: 'Türkçe' },
  { key: 'en' as const, label: 'EN', full: 'English' },
  { key: 'fr' as const, label: 'FR', full: 'Français' },
];

export default function LocalizedInput({ value, onChange, multiline, label, required, optional, error }: Props) {
  const [activeLang, setActiveLang] = useState<'tr' | 'en' | 'fr'>('tr');

  const isFilled = (key: 'tr' | 'en' | 'fr') => Boolean(value[key].trim());

  return (
    <div className={`localized-input${error ? ' has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark" title="Zorunlu alan"> *</span>}
          {required && <span className="localized-required-hint">TR · EN · FR zorunlu</span>}
          {optional && <span className="optional-badge">opsiyonel</span>}
        </label>
      )}

      <div className="localized-tabs" role="tablist">
        {langs.map((lang) => (
          <button
            key={lang.key}
            type="button"
            role="tab"
            aria-selected={activeLang === lang.key}
            className={`localized-tab${activeLang === lang.key ? ' active' : ''}${isFilled(lang.key) ? ' filled' : ''}${required && !isFilled(lang.key) ? ' incomplete' : ''}`}
            onClick={() => setActiveLang(lang.key)}
            title={lang.full}
          >
            {lang.label}
            {required && !isFilled(lang.key) && <span className="localized-tab__dot" />}
          </button>
        ))}
      </div>

      <div className="localized-field">
        <span className="lang-tag">{langs.find((l) => l.key === activeLang)?.full}</span>
        {multiline ? (
          <textarea
            value={value[activeLang]}
            onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
            rows={4}
            required={required}
            placeholder={`${langs.find((l) => l.key === activeLang)?.full} içerik...`}
          />
        ) : (
          <input
            type="text"
            value={value[activeLang]}
            onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
            required={required}
            placeholder={`${langs.find((l) => l.key === activeLang)?.full} içerik...`}
          />
        )}
      </div>
    </div>
  );
}
