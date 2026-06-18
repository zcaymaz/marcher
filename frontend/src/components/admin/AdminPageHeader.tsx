import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, backTo, backLabel = 'Geri', action }: Props) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__main">
        {backTo && (
          <Link to={backTo} className="admin-back-link">
            <i className="bi bi-arrow-left" />
            {backLabel}
          </Link>
        )}
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="admin-page-header__action">{action}</div>}
    </div>
  );
}
