import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/api';
import { getLocalized, Reference } from '../../types';

interface Props {
  references: Reference[];
}

export default function ReferencesLogoCarousel({ references }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const withLogo = references.filter((ref) => ref.logo || ref.image);
  if (withLogo.length === 0) return null;

  const items = [...withLogo, ...withLogo];

  return (
    <div className="ref-carousel" aria-label="Referans logoları">
      <div className="ref-carousel__track">
        {items.map((ref, index) => (
          <Link
            key={`${ref.id}-${index}`}
            to="/references"
            className="ref-carousel__item"
            title={getLocalized(ref.name, lang)}
          >
            <img
              src={getImageUrl(ref.logo || ref.image)}
              alt={getLocalized(ref.name, lang)}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
