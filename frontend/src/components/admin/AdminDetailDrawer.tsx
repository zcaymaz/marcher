import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AdminDetailDrawer({ open, onClose, title, subtitle, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title">
      <button type="button" className="admin-drawer__backdrop" onClick={onClose} aria-label="Kapat" />
      <aside className="admin-drawer__panel">
        <div className="admin-drawer__header">
          <div>
            <h2 id="admin-drawer-title" className="admin-drawer__title">{title}</h2>
            {subtitle && <p className="admin-drawer__subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="admin-action-btn" onClick={onClose} aria-label="Kapat">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="admin-drawer__body">{children}</div>

        {footer && <div className="admin-drawer__footer">{footer}</div>}
      </aside>
    </div>
  );
}
