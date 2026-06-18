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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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

  const validate = (): string[] => localizedFieldErrors(form.name, 'Ad');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, [field]: data.url }));
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
      if (isEdit && slug) {
        await api.put(`/references/${slug}`, form);
      } else {
        await api.post('/references', form);
      }
      navigate('/admin/references');
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Referans Düzenle' : 'Yeni Referans'}
        subtitle="Marka veya ürün referansı ekleyin"
        backTo="/admin/references"
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
            <FormSection title="Bilgiler">
              <div className="form-group">
                <FormLabel required>Tip</FormLabel>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'BRAND' | 'PRODUCT' })}
                >
                  <option value="BRAND">Marka</option>
                  <option value="PRODUCT">Ürün</option>
                </select>
              </div>
              <LocalizedInput
                label="Ad"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                error={errors.some((e) => e.startsWith('Ad'))}
              />
              <LocalizedInput
                label="Açıklama"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                multiline
                optional
              />
              <div className="form-group">
                <FormLabel optional>Sıra</FormLabel>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </FormSection>
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          <AdminCard title="Logo">
            <ImageUpload
              value={form.logo}
              uploading={uploading}
              onChange={(e) => handleUpload(e, 'logo')}
              label="Logo"
              optional
            />
          </AdminCard>
          <AdminCard title="Görsel">
            <ImageUpload
              value={form.image}
              uploading={uploading}
              onChange={(e) => handleUpload(e, 'image')}
              optional
            />
          </AdminCard>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin/references" className="btn btn-ghost">İptal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
