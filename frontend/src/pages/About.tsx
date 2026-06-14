import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('about.title')} />
      <div className="page-container about-page">
        <h1>{t('about.title')}</h1>
        <p className="subtitle">{t('about.subtitle')}</p>
        <div className="about-content">
          <p>
            Marcher Coffee Paris, Fransız kruvasan geleneği ile özel kahve kültürünü
            bir araya getiren benzersiz bir deneyim sunar. Her sabah taze pişirilen
            kruvasanlarımız ve özenle seçilmiş kahve çekirdeklerimizle Paris
            sokaklarının ruhunu yaşatıyoruz.
          </p>
          <p>
            Marcher Coffee Paris brings together French croissant tradition and
            specialty coffee culture. Our freshly baked croissants and carefully
            selected coffee beans capture the spirit of Parisian streets.
          </p>
        </div>
      </div>
    </>
  );
}
