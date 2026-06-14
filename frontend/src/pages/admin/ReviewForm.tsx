import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function ReviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    authorName: '',
    authorPhoto: '',
    rating: 5,
    text: emptyLocalized(),
    source: 'MANUAL' as 'MANUAL' | 'GOOGLE',
    googleReviewId: '',
    isVisible: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/reviews/${id}`).then(({ data }) => setForm(data));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && id) {
      await api.put(`/reviews/${id}`, form);
    } else {
      await api.post('/reviews', form);
    }
    navigate('/admin/reviews');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>{isEdit ? 'Yorum Düzenle' : 'Yeni Yorum'}</h1>
        <Link to="/admin/reviews">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Yazar Adı</label>
          <input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Puan (1-5)</label>
            <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Kaynak</label>
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as 'MANUAL' | 'GOOGLE' })}>
              <option value="MANUAL">Manuel</option>
              <option value="GOOGLE">Google</option>
            </select>
          </div>
        </div>
        {form.source === 'GOOGLE' && (
          <div className="form-group">
            <label>Google Review ID</label>
            <input value={form.googleReviewId} onChange={(e) => setForm({ ...form, googleReviewId: e.target.value })} />
          </div>
        )}
        <LocalizedInput label="Yorum Metni" value={form.text} onChange={(v) => setForm({ ...form, text: v })} multiline />
        <label><input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} /> Görünür</label>
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
