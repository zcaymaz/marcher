import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function ReferenceForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [form, setForm] = useState({
    type: 'BRAND' as 'BRAND' | 'PRODUCT',
    name: emptyLocalized(),
    description: emptyLocalized(),
    image: '',
    logo: '',
    sortOrder: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && slug) {
      api.get(`/references/${slug}`).then(({ data }) => {
        setForm({
          ...data,
          description: data.description || emptyLocalized(),
        });
      });
    }
  }, [slug, isEdit]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setForm({ ...form, [field]: data.url });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && slug) {
      await api.put(`/references/${slug}`, form);
    } else {
      await api.post('/references', form);
    }
    navigate('/admin/references');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>{isEdit ? 'Referans Düzenle' : 'Yeni Referans'}</h1>
        <Link to="/admin/references">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Tip</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'BRAND' | 'PRODUCT' })}>
            <option value="BRAND">Marka</option>
            <option value="PRODUCT">Ürün</option>
          </select>
        </div>
        <LocalizedInput label="Ad" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <LocalizedInput label="Açıklama" value={form.description} onChange={(v) => setForm({ ...form, description: v })} multiline />
        <div className="form-group">
          <label>Logo</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} />
          {form.logo && <img src={form.logo} alt="" className="preview-image" />}
        </div>
        <div className="form-group">
          <label>Görsel</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'image')} />
          {form.image && <img src={form.image} alt="" className="preview-image" />}
        </div>
        {uploading && <span>Yükleniyor...</span>}
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
