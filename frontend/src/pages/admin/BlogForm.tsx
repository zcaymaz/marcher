import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import FormSection from '../../components/admin/FormSection';
import FormRequiredNote from '../../components/admin/FormRequiredNote';
import FormLabel from '../../components/admin/FormLabel';
import ImageUpload from '../../components/admin/ImageUpload';
import { localizedFieldErrors, parseApiErrors } from '../../utils/formValidation';

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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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

  const validate = (): string[] => {
    const nextErrors: string[] = [];

    if (!form.category.trim()) {
      nextErrors.push('Kategori zorunludur.');
    }

    nextErrors.push(
      ...localizedFieldErrors(form.title, 'Başlık'),
      ...localizedFieldErrors(form.excerpt, 'Özet'),
      ...localizedFieldErrors(form.content, 'İçerik'),
    );

    return nextErrors;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors([]);

    try {
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
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Blog Düzenle' : 'Yeni Blog Yazısı'}
        subtitle="Çok dilli blog içeriği oluşturun"
        backTo="/admin/blog"
      />

      <FormRequiredNote />

      {errors.length > 0 && (
        <div className="form-errors" role="alert">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-layout" noValidate>
        <div>
          <AdminCard>
            <FormSection title="İçerik">
              <div className="form-group">
                <FormLabel required>Kategori</FormLabel>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="news"
                  required
                />
                <span className="field-hint">Örn. news, events</span>
              </div>
              <LocalizedInput
                label="Başlık"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                required
                error={errors.some((e) => e.startsWith('Başlık'))}
              />
              <LocalizedInput
                label="Özet"
                value={form.excerpt}
                onChange={(v) => setForm({ ...form, excerpt: v })}
                multiline
                required
                error={errors.some((e) => e.startsWith('Özet'))}
              />
              <LocalizedInput
                label="İçerik (HTML)"
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
                multiline
                required
                error={errors.some((e) => e.startsWith('İçerik'))}
              />
              <div className="form-group">
                <FormLabel optional>Anahtar Kelimeler</FormLabel>
                <input
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  placeholder="kahve, paris, kruvasan"
                />
                <span className="field-hint">Virgülle ayırın</span>
              </div>
            </FormSection>
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          <AdminCard title="Kapak Görseli">
            <ImageUpload
              value={form.image}
              uploading={uploading}
              onChange={handleUpload}
              optional
            />
          </AdminCard>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin/blog" className="btn btn-ghost">İptal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
