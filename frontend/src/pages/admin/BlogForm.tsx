import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function BlogForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [form, setForm] = useState({
    category: 'news',
    title: emptyLocalized(),
    excerpt: emptyLocalized(),
    content: emptyLocalized(),
    image: '',
    keywords: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && slug) {
      api.get(`/blog/${slug}`).then(({ data }) => {
        setForm({
          ...data,
          keywords: data.keywords?.join(', ') || '',
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
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    };
    if (isEdit && slug) {
      await api.put(`/blog/${slug}`, payload);
    } else {
      await api.post('/blog', payload);
    }
    navigate('/admin/blog');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>{isEdit ? 'Blog Düzenle' : 'Yeni Blog Yazısı'}</h1>
        <Link to="/admin/blog">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Kategori</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <LocalizedInput label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <LocalizedInput label="Özet" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} multiline />
        <LocalizedInput label="İçerik (HTML)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} multiline />
        <div className="form-group">
          <label>Görsel</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>Yükleniyor...</span>}
          {form.image && <img src={form.image} alt="" className="preview-image" />}
        </div>
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
