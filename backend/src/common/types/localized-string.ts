export type LocalizedString = {
  tr: string;
  en: string;
  fr: string;
};

export const emptyLocalized = (): LocalizedString => ({
  tr: '',
  en: '',
  fr: '',
});

export const getLocalized = (
  value: unknown,
  lang: string,
  fallbackLang = 'tr',
): string => {
  if (!value || typeof value !== 'object') return '';
  const obj = value as Record<string, string>;
  return obj[lang] || obj[fallbackLang] || Object.values(obj)[0] || '';
};
