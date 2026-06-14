import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Geçersiz e-posta veya şifre');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="login-card">
        <div className="admin-brand">
          <span className="logo-mark">M</span>
          <h1>Marcher Admin</h1>
        </div>
        <div className="form-group">
          <label>{t('admin.email')}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admin.password')}</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary">{t('admin.login')}</button>
      </form>
    </div>
  );
}
