/** Transparent logos (background removed) + source files in /public/logos */

export const BRAND_LOGOS = {
  /** Transparent PNG — dark text for light backgrounds */
  wordmarkBrown: '/logos/wordmark-brown.png',
  /** Transparent PNG — cream text for dark backgrounds */
  wordmarkCream: '/logos/wordmark-cream.png',
  /** Transparent PNG — stacked wordmark */
  stackedBrown: '/logos/stacked-brown.png',
  /** Transparent PNG — king emblem only */
  emblemDark: '/logos/emblem-dark.png',
} as const;

export const BRAND_ALT = 'Marcher Coffee Paris';

export type BrandLogoVariant =
  | 'header'
  | 'footer'
  | 'admin'
  | 'login-form'
  | 'menu'
  | 'emblem';

export function getBrandLogoSrc(variant: BrandLogoVariant): string {
  switch (variant) {
    case 'header':
    case 'admin':
    case 'login-form':
      return BRAND_LOGOS.wordmarkBrown;
    case 'footer':
      return BRAND_LOGOS.wordmarkCream;
    case 'menu':
      return BRAND_LOGOS.stackedBrown;
    case 'emblem':
      return BRAND_LOGOS.emblemDark;
    default:
      return BRAND_LOGOS.wordmarkBrown;
  }
}
