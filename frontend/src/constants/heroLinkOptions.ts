export const HERO_LINK_OPTIONS = [
  { value: '/', label: 'Ana Sayfa' },
  { value: '/menu', label: 'Menü' },
  { value: '/about', label: 'Hakkımızda' },
  { value: '/blog', label: 'Blog' },
  { value: '/franchise', label: 'Franchise' },
  { value: '/references', label: 'Referanslar' },
] as const;

export const HERO_CUSTOM_LINK = '__custom__';

export function resolveHeroLinkPreset(link: string): string {
  const match = HERO_LINK_OPTIONS.find((option) => option.value === link);
  return match ? match.value : HERO_CUSTOM_LINK;
}
