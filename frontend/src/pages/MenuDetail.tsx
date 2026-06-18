import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { formatPrice } from '../utils/formatPrice';
import { getLocalized, MenuItem } from '../types';
import SEO from '../components/common/SEO';

export default function MenuDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [item, setItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (slug) {
      api.get(`/menu/${slug}`).then(({ data }) => setItem(data));
    }
  }, [slug]);

  if (!item) return <p className="loading-text">{t('common.loading')}</p>;

  return (
    <>
      <SEO title={getLocalized(item.name, lang)} />
      <div className="menu-detail-page">
        <Link to="/menu" className="back-link">
          <i className="bi bi-arrow-left"></i> {t('common.back')}
        </Link>

        <div className="menu-detail">
          {item.image && (
            <img src={getImageUrl(item.image)} alt="" className="menu-detail-image" />
          )}
          <div className="menu-detail-content">
            <span className="category-badge">{t(`menu.${item.category}`)}</span>
            <h1>{getLocalized(item.name, lang)}</h1>
            <p className="description">{getLocalized(item.description, lang)}</p>

            <div className="price-block">
              <span className="price">{formatPrice(item.price)}</span>
              {item.oldPrice && (
                <span className="old-price">{formatPrice(item.oldPrice)}</span>
              )}
            </div>

            {!item.isAvailable && (
              <span className="unavailable-badge">{t('menu.unavailable')}</span>
            )}

            {item.details && (
              <div className="details-block">
                <h3>{t('menu.details')}</h3>
                <p>{getLocalized(item.details, lang)}</p>
              </div>
            )}

            {item.allergens.length > 0 && (
              <div className="allergens-block">
                <h3>{t('menu.allergens')}</h3>
                <div className="allergen-list">
                  {item.allergens.map((a) => (
                    <span key={a} className="allergen-tag">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
