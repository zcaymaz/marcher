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
  value: LocalizedString | unknown,
  lang: string,
): string => {
  if (!value || typeof value !== 'object') return '';
  const obj = value as LocalizedString;
  return obj[lang as keyof LocalizedString] || obj.tr || obj.en || obj.fr || '';
};

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images: string[];
  name: LocalizedString;
  description: LocalizedString;
  details?: LocalizedString;
  tags: string[];
  allergens: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  date: string;
  image?: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  keywords: string[];
}

export interface Campaign {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  ctaText?: LocalizedString;
  ctaLink?: string;
  image?: string;
  isActive: boolean;
  placement: string;
  sortOrder: number;
}

export interface Reference {
  id: string;
  slug: string;
  type: 'BRAND' | 'PRODUCT';
  name: LocalizedString;
  image?: string;
  logo?: string;
  description?: LocalizedString;
  sortOrder: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: LocalizedString;
  source: 'MANUAL' | 'GOOGLE';
  isVisible: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address?: LocalizedString;
  googleMapsEmbedUrl?: string;
  googlePlaceId?: string;
  socialLinks?: Record<string, string>;
}

export interface FranchiseInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
}

export interface DashboardStats {
  menuCount: number;
  blogCount: number;
  campaignCount: number;
  franchiseNew: number;
  reviewCount: number;
  referenceCount: number;
}
