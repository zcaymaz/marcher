import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Review, getLocalized } from '../../types';

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.get('/reviews').then(({ data }) => setReviews(data));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Yorum Yönetimi</h1>
        <Link to="/admin/reviews/new" className="btn btn-primary">Yeni Yorum</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Yazar</th><th>Puan</th><th>Kaynak</th><th>Görünür</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.authorName}</td>
              <td>{'★'.repeat(r.rating)}</td>
              <td>{r.source}</td>
              <td>{r.isVisible ? 'Evet' : 'Hayır'}</td>
              <td className="actions">
                <Link to={`/admin/reviews/edit/${r.id}`}>Düzenle</Link>
                <button onClick={() => handleDelete(r.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
