interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function AdminCard({ title, subtitle, children, noPadding, className = '' }: Props) {
  return (
    <div className={`admin-card ${noPadding ? 'admin-card--flush' : ''} ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="admin-card__header">
          {title && <h2 className="admin-card__title">{title}</h2>}
          {subtitle && <p className="admin-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="admin-card__body">{children}</div>
    </div>
  );
}
