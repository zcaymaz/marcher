import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized, LocalizedString } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function MenuForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [form, setForm] = useState({
    category: 'coffee',
    name: emptyLocalized(),
    description: emptyLocalized(),
    details: emptyLocalized(),
    price: 0,
    oldPrice: 0,
    image: '',
    tags: '',
    allergens: '',
    isFeatured: false,
    isAvailable: true,
    sortOrder: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && slug) {
      api.get(`/menu/${slug}`).then(({ data }) => {
        setForm({
          ...data,
          tags: data.tags?.join(', ') || '',
          allergens: data.allergens?.join(', ') || '',
          details: data.details || emptyLocalized(),
        });
      });
    }
  }, [slug, isEdit]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setForm({ ...form, image: data.url });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      allergens: form.allergens.split(',').map((a) => a.trim()).filter(Boolean),
      oldPrice: form.oldPrice || undefined,
    };
    if (isEdit && slug) {
      await api.put(`/menu/${slug}`, payload);
    } else {
      await api.post('/menu', payload);
    }
    navigate('/admin/menu');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>{isEdit ? 'Menü Düzenle' : 'Yeni Menü Öğesi'}</h1>
        <Link to="/admin/menu">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Kategori</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="coffee">Kahve</option>
            <option value="croissant">Kruvasan</option>
            <option value="pastry">Hamur İşi</option>
            <option value="food">Yemek</option>
            <option value="cold">Soğuk İçecek</option>
          </select>
        </div>

        <LocalizedInput label="Ad" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <LocalizedInput label="Açıklama" value={form.description} onChange={(v) => setForm({ ...form, description: v })} multiline />
        <LocalizedInput label="Detaylar" value={form.details} onChange={(v) => setForm({ ...form, details: v })} multiline />

        <div className="form-row">
          <div className="form-group">
            <label>Fiyat (€)</label>
            <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Eski Fiyat (€)</label>
            <input type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: parseFloat(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Sıra</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label>Alerjenler (virgülle ayırın)</label>
          <input value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Görsel</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>Yükleniyor...</span>}
          {form.image && <img src={form.image} alt="" className="preview-image" />}
        </div>

        <div className="form-checks">
          <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Öne Çıkan</label>
          <label><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Mevcut</label>
        </div>

        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
