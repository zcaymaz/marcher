import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Review } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews').then(({ data }) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Yorum Yönetimi"
        subtitle={`${reviews.length} yorum`}
        action={
          <Link to="/admin/reviews/new" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> Yeni Yorum
          </Link>
        }
      />

      <AdminCard noPadding>
        {reviews.length === 0 ? (
          <AdminEmptyState
            icon="bi-star"
            title="Henüz yorum yok"
            action={
              <Link to="/admin/reviews/new" className="btn btn-primary btn-sm">
                Yeni Yorum
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Yazar</th>
                  <th>Puan</th>
                  <th>Kaynak</th>
                  <th>Görünür</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="table-cell-title">{r.authorName}</td>
                    <td><span style={{ color: 'var(--warning)' }}>{'★'.repeat(r.rating)}</span></td>
                    <td><AdminBadge variant="info">{r.source}</AdminBadge></td>
                    <td>
                      <AdminBadge variant={r.isVisible ? 'success' : 'default'} dot>
                        {r.isVisible ? 'Evet' : 'Hayır'}
                      </AdminBadge>
                    </td>
                    <td>
                      <AdminTableActions
                        editTo={`/admin/reviews/edit/${r.id}`}
                        onDelete={() => handleDelete(r.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
