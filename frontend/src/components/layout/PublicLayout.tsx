import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { getLocalized } from '../../types';
import { Campaign } from '../../types';
import LanguageSwitcher from '../common/LanguageSwitcher';
import BrandLogo from '../common/BrandLogo';
import WhatsAppFab from '../common/WhatsAppFab';
import SiteFooter from './SiteFooter';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isMenuRoute = location.pathname.startsWith('/menu');
  const [banner, setBanner] = useState<Campaign | null>(null);

  useEffect(() => {
    if (isMenuRoute) return;
    api
      .get('/campaigns/active?placement=HOME_BANNER')
      .then((res) => setBanner(res.data[0] ?? null))
      .catch(() => setBanner(null));
  }, [isMenuRoute]);

  const announcementText = banner
    ? getLocalized(banner.title, i18n.language)
    : t('announcement.default');

  return (
    <div className={`public-layout ${isMenuRoute ? 'menu-layout' : ''}`}>
      {!isMenuRoute && (
        <div className="announcement-bar">
          <p>{announcementText}</p>
        </div>
      )}

      <header className="site-header">
        <div className="container header-inner">
          <BrandLogo variant="header" to="/" />

          <nav className="main-nav" aria-label="Main">
            <Link to="/menu">{t('nav.menu')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/blog">{t('nav.blog')}</Link>
            <Link to="/franchise">{t('nav.franchise')}</Link>
          </nav>

          <div className="header-actions">
            <Link to="/menu" className="nav-cta">
              {t('nav.menu_cta')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {!isMenuRoute && <SiteFooter />}

      <WhatsAppFab />
    </div>
  );
}
