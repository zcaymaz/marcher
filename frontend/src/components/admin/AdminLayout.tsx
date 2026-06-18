import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

const navGroups = [
  {
    labelKey: 'admin.nav_general',
    items: [
      { to: '/admin/dashboard', labelKey: 'admin.dashboard', icon: 'bi-speedometer2', color: 'primary' },
    ],
  },
  {
    labelKey: 'admin.nav_content',
    items: [
      { to: '/admin/menu', labelKey: 'admin.menu', icon: 'bi-cup-hot', color: 'warning' },
      { to: '/admin/blog', labelKey: 'admin.blog', icon: 'bi-journal-text', color: 'info' },
      { to: '/admin/references', labelKey: 'admin.references', icon: 'bi-images', color: 'success' },
      { to: '/admin/reviews', labelKey: 'admin.reviews', icon: 'bi-star', color: 'warning' },
    ],
  },
  {
    labelKey: 'admin.nav_marketing',
    items: [
      { to: '/admin/campaigns', labelKey: 'admin.campaigns', icon: 'bi-megaphone', color: 'error' },
      { to: '/admin/franchise', labelKey: 'admin.franchise', icon: 'bi-building', color: 'info' },
    ],
  },
  {
    labelKey: 'admin.nav_system',
    items: [
      { to: '/admin/settings', labelKey: 'admin.settings', icon: 'bi-gear', color: 'default' },
      { to: '/admin/users', labelKey: 'admin.users', icon: 'bi-people', color: 'primary' },
    ],
  },
];

function getInitials(name?: string) {
  if (!name) return 'A';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`admin-layout${sidebarOpen ? ' sidebar-open' : ''}`}>
      <div className="admin-sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />

      <aside className="admin-sidebar">
        <div className="admin-brand admin-brand--surface">
          <BrandLogo variant="admin" to="/admin/dashboard" />
        </div>

        <nav className="admin-nav">
          {navGroups.map((group) => (
            <div key={group.labelKey} className="admin-nav-group">
              <span className="admin-nav-group__label">{t(group.labelKey)}</span>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `admin-nav-item admin-nav-item--${item.color}${isActive ? ' active' : ''}`
                  }
                >
                  <span className="admin-nav-item__icon">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-user">
          <div className="admin-user__info">
            <span className="admin-user__avatar">{getInitials(user?.name)}</span>
            <div>
              <span className="admin-user__name">{user?.name}</span>
              <span className="admin-user__role">Yönetici</span>
            </div>
          </div>
          <button type="button" className="admin-user__logout" onClick={handleLogout} title={t('admin.logout')}>
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Menü"
          >
            <i className="bi bi-list" />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar__link">
            <i className="bi bi-box-arrow-up-right" />
            Siteyi Görüntüle
          </a>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
