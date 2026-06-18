type Variant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface Props {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
}

export default function AdminBadge({ variant = 'default', children, dot }: Props) {
  return (
    <span className={`admin-badge admin-badge--${variant}`}>
      {dot && <span className="admin-badge__dot" />}
      {children}
    </span>
  );
}
