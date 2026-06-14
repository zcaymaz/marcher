import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import SEO from '../components/common/SEO';

export default function Franchise() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/franchise', form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', city: '', message: '', website: '' });
    } catch {
      setError(t('common.error'));
    }
  };

  return (
    <>
      <SEO title={t('franchise.title')} />
      <div className="page-container franchise-page">
        <h1>{t('franchise.title')}</h1>
        <p className="subtitle">{t('franchise.subtitle')}</p>

        {submitted ? (
          <div className="success-message">{t('franchise.success')}</div>
        ) : (
          <form onSubmit={handleSubmit} className="franchise-form">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="form-group">
              <label>{t('franchise.name')}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('franchise.email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t('franchise.phone')}</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('franchise.city')}</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t('franchise.message')}</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn btn-primary">
              {t('franchise.submit')}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
