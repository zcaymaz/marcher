import { LocalizedString } from '../types';

export function localizedFieldErrors(
  value: LocalizedString,
  label: string,
): string[] {
  const errors: string[] = [];
  if (!value.tr.trim()) errors.push(`${label} (Türkçe) zorunludur.`);
  if (!value.en.trim()) errors.push(`${label} (English) zorunludur.`);
  if (!value.fr.trim()) errors.push(`${label} (Français) zorunludur.`);
  return errors;
}

export function parseApiErrors(error: unknown): string[] {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return ['Bir hata oluştu. Lütfen tekrar deneyin.'];
  }

  const response = (error as { response?: { data?: { message?: string | string[] } } }).response;
  const message = response?.data?.message;

  if (Array.isArray(message)) return message;
  if (typeof message === 'string') return [message];
  return ['Bir hata oluştu. Lütfen tekrar deneyin.'];
}
