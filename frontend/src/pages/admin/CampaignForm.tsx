import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function CampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: emptyLocalized(),
    subtitle: emptyLocalized(),
    ctaText: emptyLocalized(),
    ctaLink: '/menu',
    image: '',
    isActive: true,
    placement: 'HOME_HERO',
    sortOrder: 0,
    startDate: '',
    endDate: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/campaigns/${id}`).then(({ data }) => {
        setForm({
          ...data,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          subtitle: data.subtitle || emptyLocalized(),
          ctaText: data.ctaText || emptyLocalized(),
        });
      });
    }
  }, [id, isEdit]);

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
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };
    if (isEdit && id) {
      await api.put(`/campaigns/${id}`, payload);
    } else {
      await api.post('/campaigns', payload);
    }
    navigate('/admin/campaigns');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>{isEdit ? 'Kampanya Düzenle' : 'Yeni Kampanya'}</h1>
        <Link to="/admin/campaigns">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <LocalizedInput label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <LocalizedInput label="Alt Başlık" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
        <LocalizedInput label="CTA Metni" value={form.ctaText} onChange={(v) => setForm({ ...form, ctaText: v })} />
        <div className="form-group">
          <label>CTA Link</label>
          <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Yerleşim</label>
            <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
              <option value="HOME_HERO">Ana Sayfa Hero</option>
              <option value="HOME_BANNER">Ana Sayfa Banner</option>
              <option value="MENU_BANNER">Menü Banner</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sıra</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Başlangıç</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bitiş</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Görsel</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>Yükleniyor...</span>}
          {form.image && <img src={form.image} alt="" className="preview-image" />}
        </div>
        <label><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Aktif</label>
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
