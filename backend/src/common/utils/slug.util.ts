import slugify from 'slugify';

export const generateSlug = (text: string): string =>
  slugify(text, { lower: true, strict: true });

export const getNameForSlug = (name: unknown): string => {
  if (!name || typeof name !== 'object') return 'item';
  const obj = name as Record<string, string>;
  return obj.tr || obj.en || obj.fr || 'item';
};
