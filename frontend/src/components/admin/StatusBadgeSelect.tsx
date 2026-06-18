import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type FranchiseStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

const STATUS_OPTIONS: { value: FranchiseStatus; label: string; badge: string }[] = [
  { value: 'NEW', label: 'Yeni', badge: 'admin-badge--warning' },
  { value: 'CONTACTED', label: 'İletişime Geçildi', badge: 'admin-badge--info' },
  { value: 'CLOSED', label: 'Kapatıldı', badge: 'admin-badge--default' },
];

interface Props {
  value: FranchiseStatus;
  onChange: (status: FranchiseStatus) => void;
  disabled?: boolean;
}

export function getStatusMeta(status: FranchiseStatus) {
  return STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
}

export default function StatusBadgeSelect({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const current = getStatusMeta(value);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuWidth = 220;
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 12);

    setMenuStyle({
      position: 'fixed',
      top: rect.bottom + 6,
      left: Math.max(12, left),
      minWidth: Math.max(rect.width, menuWidth),
      zIndex: 1200,
    });
  };

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleReposition = () => setOpen(false);

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open]);

  const menu = open
    ? createPortal(
        <ul
          ref={menuRef}
          className="status-select__menu status-select__menu--fixed"
          style={menuStyle}
          role="listbox"
        >
          {STATUS_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`status-select__option${value === option.value ? ' active' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span className={`admin-badge ${option.badge}`}>
                  <span className="admin-badge__dot" />
                  {option.label}
                </span>
              </button>
            </li>
          ))}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div className={`status-select${disabled ? ' status-select--disabled' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="status-select__trigger"
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={`admin-badge ${current.badge}`}>
          <span className="admin-badge__dot" />
          {current.label}
        </span>
        <i className={`bi bi-chevron-down status-select__chevron${open ? ' open' : ''}`} />
      </button>
      {menu}
    </div>
  );
}
