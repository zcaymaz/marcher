import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { getLocalized, Reference } from '../types';
import SEO from '../components/common/SEO';

export default function References() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [refs, setRefs] = useState<Reference[]>([]);

  useEffect(() => {
    api.get('/references').then(({ data }) => setRefs(data));
  }, []);

  const brands = refs.filter((r) => r.type === 'BRAND');
  const products = refs.filter((r) => r.type === 'PRODUCT');

  return (
    <>
      <SEO title={t('references.title')} />
      <div className="page-container">
        <h1>{t('references.title')}</h1>

        {brands.length > 0 && (
          <section className="ref-section">
            <h2>{t('references.brands')}</h2>
            <div className="references-grid">
              {brands.map((ref) => (
                <div key={ref.id} className="reference-card large">
                  {(ref.logo || ref.image) && (
                    <img src={getImageUrl(ref.logo || ref.image)} alt="" />
                  )}
                  <h3>{getLocalized(ref.name, lang)}</h3>
                  {ref.description && <p>{getLocalized(ref.description, lang)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section className="ref-section">
            <h2>{t('references.products')}</h2>
            <div className="references-grid">
              {products.map((ref) => (
                <div key={ref.id} className="reference-card large">
                  {ref.image && <img src={getImageUrl(ref.image)} alt="" />}
                  <h3>{getLocalized(ref.name, lang)}</h3>
                  {ref.description && <p>{getLocalized(ref.description, lang)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
