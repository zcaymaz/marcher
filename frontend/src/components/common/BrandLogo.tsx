import { Link } from 'react-router-dom';
import { BRAND_ALT, BrandLogoVariant, getBrandLogoSrc } from '../../constants/brandLogos';

interface Props {
  variant?: BrandLogoVariant;
  to?: string;
  className?: string;
}

export default function BrandLogo({ variant = 'header', to, className = '' }: Props) {
  const src = getBrandLogoSrc(variant);
  const img = (
    <img
      src={src}
      alt={BRAND_ALT}
      className={`brand-logo brand-logo--${variant} ${className}`.trim()}
    />
  );

  if (to) {
    return (
      <Link to={to} className={`brand-logo-link brand-logo-link--${variant}`}>
        {img}
      </Link>
    );
  }

  return img;
}
