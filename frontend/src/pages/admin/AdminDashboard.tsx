import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { DashboardStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p>Yükleniyor...</p>;

  const cards = [
    { label: 'Menü Öğeleri', value: stats.menuCount, link: '/admin/menu', icon: 'bi-cup-hot' },
    { label: 'Blog Yazıları', value: stats.blogCount, link: '/admin/blog', icon: 'bi-journal-text' },
    { label: 'Aktif Kampanyalar', value: stats.campaignCount, link: '/admin/campaigns', icon: 'bi-megaphone' },
    { label: 'Yeni Franchise', value: stats.franchiseNew, link: '/admin/franchise', icon: 'bi-building' },
    { label: 'Yorumlar', value: stats.reviewCount, link: '/admin/reviews', icon: 'bi-star' },
    { label: 'Referanslar', value: stats.referenceCount, link: '/admin/references', icon: 'bi-images' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {cards.map((card) => (
          <Link to={card.link} key={card.label} className="stat-card">
            <i className={`bi ${card.icon}`}></i>
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
