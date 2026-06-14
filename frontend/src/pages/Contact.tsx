import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { getLocalized } from '../types';
import SEO from '../components/common/SEO';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const lang = i18n.language;

  return (
    <>
      <SEO title={t('contact.title')} />
      <div className="page-container contact-page">
        <h1>{t('contact.title')}</h1>
        <div className="contact-grid">
          <div className="contact-info">
            {settings?.address && (
              <div className="contact-item">
                <i className="bi bi-geo-alt"></i>
                <div>
                  <h3>{t('contact.address')}</h3>
                  <p>{getLocalized(settings.address, lang)}</p>
                </div>
              </div>
            )}
            {settings?.phone && (
              <div className="contact-item">
                <i className="bi bi-telephone"></i>
                <div>
                  <h3>{t('contact.phone')}</h3>
                  <p>{settings.phone}</p>
                </div>
              </div>
            )}
            {settings?.email && (
              <div className="contact-item">
                <i className="bi bi-envelope"></i>
                <div>
                  <h3>{t('contact.email')}</h3>
                  <p>{settings.email}</p>
                </div>
              </div>
            )}
          </div>
          {settings?.googleMapsEmbedUrl && (
            <div className="contact-map">
              <iframe
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Marcher Coffee Paris Map"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
