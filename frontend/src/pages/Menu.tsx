import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { formatPrice } from '../utils/formatPrice';
import { getLocalized, MenuItem, Campaign } from '../types';
import SEO from '../components/common/SEO';
import BrandLogo from '../components/common/BrandLogo';

const categories = ['all', 'coffee', 'croissant', 'pastry', 'food', 'cold'];

export default function Menu() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [banner, setBanner] = useState<Campaign | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/menu?available=true'),
      api.get('/campaigns/active?placement=MENU_BANNER'),
    ])
      .then(([menuRes, bannerRes]) => {
        setItems(menuRes.data);
        setBanner(bannerRes.data[0] ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <SEO title={t('menu.title')} />
      <div className="menu-page">
        <div className="menu-header">
          <BrandLogo variant="menu" to="/" />
          <p className="menu-subtitle">Marcher Coffee Paris</p>
        </div>

        {banner && (
          <div className="menu-campaign-banner">
            {banner.image && (
              <img src={getImageUrl(banner.image)} alt="" className="menu-campaign-banner__image" />
            )}
            <div className="menu-campaign-banner__content">
              <strong>{getLocalized(banner.title, lang)}</strong>
              {banner.subtitle && (
                <p>{getLocalized(banner.subtitle, lang)}</p>
              )}
            </div>
          </div>
        )}

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`menu.${cat}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading-text">{t('common.loading')}</p>
        ) : (
          <div className="menu-list">
            {filtered.map((item) => (
              <Link to={`/menu/${item.slug}`} key={item.id} className="menu-list-item">
                {item.image && (
                  <img src={getImageUrl(item.image)} alt="" className="menu-item-thumb" />
                )}
                <div className="menu-item-info">
                  <h3>{getLocalized(item.name, lang)}</h3>
                  <p>{getLocalized(item.description, lang)}</p>
                  {item.allergens.length > 0 && (
                    <span className="allergen-tags">
                      {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
                <span className="menu-item-price">{formatPrice(item.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
