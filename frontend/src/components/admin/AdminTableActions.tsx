import { Link } from 'react-router-dom';

interface Props {
  editTo?: string;
  onView?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  viewLabel?: string;
}

export default function AdminTableActions({
  editTo,
  onView,
  onDelete,
  deleteLabel = 'Sil',
  viewLabel = 'Detay',
}: Props) {
  return (
    <div className="admin-table-actions">
      {onView && (
        <button
          type="button"
          className="admin-action-btn admin-action-btn--view"
          onClick={onView}
          title={viewLabel}
        >
          <i className="bi bi-eye" />
        </button>
      )}
      {editTo && (
        <Link to={editTo} className="admin-action-btn admin-action-btn--edit" title="Düzenle">
          <i className="bi bi-pencil" />
        </Link>
      )}
      {onDelete && (
        <button type="button" className="admin-action-btn admin-action-btn--delete" onClick={onDelete} title={deleteLabel}>
          <i className="bi bi-trash3" />
        </button>
      )}
    </div>
  );
}
