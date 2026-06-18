import { Link } from 'react-router-dom';

interface Props {
  label: string;
  value: number;
  icon: string;
  link: string;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error';
}

export default function AdminStatCard({ label, value, icon, link, color = 'primary' }: Props) {
  return (
    <Link to={link} className={`admin-stat-card admin-stat-card--${color}`}>
      <div className="admin-stat-card__icon">
        <i className={`bi ${icon}`} />
      </div>
      <div className="admin-stat-card__content">
        <span className="admin-stat-card__value">{value}</span>
        <span className="admin-stat-card__label">{label}</span>
      </div>
      <i className="bi bi-chevron-right admin-stat-card__arrow" />
    </Link>
  );
}
