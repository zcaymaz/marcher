import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import WhatsAppFab from '../common/WhatsAppFab';

export default function PublicLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const isMenuRoute = location.pathname.startsWith('/menu');

  return (
    <div className={`public-layout ${isMenuRoute ? 'menu-layout' : ''}`}>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">M</span>
            <span className="logo-text">Marcher Coffee</span>
          </Link>
          <nav className="main-nav">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/menu">{t('nav.menu')}</Link>
            <Link to="/blog">{t('nav.blog')}</Link>
            <Link to="/references">{t('nav.references')}</Link>
            <Link to="/franchise">{t('nav.franchise')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {!isMenuRoute && (
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <span className="logo-mark">M</span>
              <p>Marcher Coffee Paris</p>
            </div>
            <div className="footer-links">
              <Link to="/menu">{t('nav.menu')}</Link>
              <Link to="/franchise">{t('nav.franchise')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
            </div>
            <p className="footer-copy">&copy; {new Date().getFullYear()} Marcher Coffee</p>
          </div>
        </footer>
      )}

      <WhatsAppFab />
    </div>
  );
}
