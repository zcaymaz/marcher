import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { getLocalized } from '../../types';
import BrandLogo from '../common/BrandLogo';

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'bi-instagram',
  facebook: 'bi-facebook',
  twitter: 'bi-twitter-x',
  x: 'bi-twitter-x',
  youtube: 'bi-youtube',
  linkedin: 'bi-linkedin',
};

const MENU_CATEGORIES = ['coffee', 'croissant', 'pastry'] as const;

export default function SiteFooter() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const lang = i18n.language;
  const year = new Date().getFullYear();

  const socialLinks = settings?.socialLinks
    ? Object.entries(settings.socialLinks).filter(([, url]) => Boolean(url))
    : [];

  const address = settings?.address ? getLocalized(settings.address, lang) : null;
  const hasContact = Boolean(address || settings?.phone || settings?.email);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandLogo variant="footer" to="/" />
            <p className="footer-tagline">{t('footer.tagline')}</p>

            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="footer-social-link"
                  >
                    <i className={`bi ${SOCIAL_ICONS[key.toLowerCase()] || 'bi-link-45deg'}`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.corporate')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/blog">{t('nav.blog')}</Link></li>
              <li><Link to="/references">{t('nav.references')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.services')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/franchise">{t('nav.franchise')}</Link></li>
              <li><Link to="/menu">{t('nav.menu_cta')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('nav.menu')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/menu">{t('menu.all')}</Link></li>
              {MENU_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to="/menu">{t(`menu.${cat}`)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {hasContact && (
            <div className="footer-col footer-contact">
              <h4 className="footer-col-title">{t('footer.contact')}</h4>
              <ul className="footer-contact-list">
                {address && (
                  <li>
                    <i className="bi bi-geo-alt" aria-hidden="true" />
                    {settings?.addressUrl ? (
                      <a
                        href={settings.addressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {address}
                      </a>
                    ) : (
                      <span>{address}</span>
                    )}
                  </li>
                )}
                {settings?.phone && (
                  <li>
                    <i className="bi bi-telephone" aria-hidden="true" />
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                  </li>
                )}
                {settings?.email && (
                  <li>
                    <i className="bi bi-envelope" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  );
}
