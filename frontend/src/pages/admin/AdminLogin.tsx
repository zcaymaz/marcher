import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/common/BrandLogo';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Geçersiz e-posta veya şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__brand">
        <div className="admin-login__brand-overlay" />
        <p>Geleneksel Fransız reçeteleri, modern dokunuşlar. İçerik yönetim paneline giriş yapın.</p>
      </div>

      <div className="admin-login__form-wrap">
        <form onSubmit={handleSubmit} className="login-card">
          <div className="login-card__brand">
            <BrandLogo variant="login-form" />
            <h1>Admin Girişi</h1>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@marcher.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-errors" role="alert">
              <p>{error}</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : t('admin.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
