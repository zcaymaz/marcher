interface Props {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminEmptyState({ icon = 'bi-inbox', title, description, action }: Props) {
  return (
    <div className="admin-empty">
      <div className="admin-empty__icon">
        <i className={`bi ${icon}`} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="admin-empty__action">{action}</div>}
    </div>
  );
}
