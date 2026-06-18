import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { DashboardStats } from '../../types';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminStatCard from '../../components/admin/AdminStatCard';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <AdminLoading />;

  const cards = [
    { label: 'Menü Öğeleri', value: stats.menuCount, link: '/admin/menu', icon: 'bi-cup-hot', color: 'warning' as const },
    { label: 'Blog Yazıları', value: stats.blogCount, link: '/admin/blog', icon: 'bi-journal-text', color: 'info' as const },
    { label: 'Aktif Kampanyalar', value: stats.campaignCount, link: '/admin/campaigns', icon: 'bi-megaphone', color: 'error' as const },
    { label: 'Yeni Franchise', value: stats.franchiseNew, link: '/admin/franchise', icon: 'bi-building', color: 'info' as const },
    { label: 'Yorumlar', value: stats.reviewCount, link: '/admin/reviews', icon: 'bi-star', color: 'warning' as const },
    { label: 'Referanslar', value: stats.referenceCount, link: '/admin/references', icon: 'bi-images', color: 'success' as const },
  ];

  return (
    <div>
      <div className="admin-dashboard-welcome">
        <h1>Merhaba, {user?.name?.split(' ')[0] ?? 'Admin'} 👋</h1>
        <p>{t('home.brand_tagline')} — yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <AdminStatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
