import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', labelKey: 'admin.dashboard', icon: 'bi-speedometer2' },
  { to: '/admin/menu', labelKey: 'admin.menu', icon: 'bi-cup-hot' },
  { to: '/admin/campaigns', labelKey: 'admin.campaigns', icon: 'bi-megaphone' },
  { to: '/admin/blog', labelKey: 'admin.blog', icon: 'bi-journal-text' },
  { to: '/admin/references', labelKey: 'admin.references', icon: 'bi-images' },
  { to: '/admin/reviews', labelKey: 'admin.reviews', icon: 'bi-star' },
  { to: '/admin/franchise', labelKey: 'admin.franchise', icon: 'bi-building' },
  { to: '/admin/settings', labelKey: 'admin.settings', icon: 'bi-gear' },
  { to: '/admin/users', labelKey: 'admin.users', icon: 'bi-people' },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-mark">M</span>
          <span>Marcher Admin</span>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <i className={`bi ${item.icon}`}></i>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>{t('admin.logout')}</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
