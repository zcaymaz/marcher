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

function hasLocalizedContent(value: ReturnType<typeof emptyLocalized>): boolean {
  return Boolean(value.tr.trim() || value.en.trim() || value.fr.trim());
}

export default function MenuForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [form, setForm] = useState({
    category: 'coffee',
    name: emptyLocalized(),
    description: emptyLocalized(),
    details: emptyLocalized(),
    price: '',
    oldPrice: '',
    image: '',
    tags: '',
    allergens: '',
    isFeatured: false,
    isAvailable: true,
    sortOrder: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && slug) {
      api.get(`/menu/${slug}`).then(({ data }) => {
        setForm({
          category: data.category,
          name: data.name,
          description: data.description,
          details: data.details || emptyLocalized(),
          price: String(data.price ?? ''),
          oldPrice: data.oldPrice ? String(data.oldPrice) : '',
          image: data.image || '',
          tags: data.tags?.join(', ') || '',
          allergens: data.allergens?.join(', ') || '',
          isFeatured: data.isFeatured,
          isAvailable: data.isAvailable,
          sortOrder: data.sortOrder ?? 0,
        });
      });
    }
  }, [slug, isEdit]);

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

  const validate = (): string[] => {
    const nextErrors = [
      ...localizedFieldErrors(form.name, 'Ad'),
      ...localizedFieldErrors(form.description, 'Açıklama'),
    ];

    const price = parseFloat(form.price);
    if (!form.price.trim() || Number.isNaN(price)) {
      nextErrors.push('Fiyat zorunludur.');
    } else if (price <= 0) {
      nextErrors.push('Fiyat 0\'dan büyük olmalıdır.');
    }

    if (form.oldPrice.trim()) {
      const oldPrice = parseFloat(form.oldPrice);
      if (Number.isNaN(oldPrice) || oldPrice <= 0) {
        nextErrors.push('Eski fiyat geçerli bir tutar olmalıdır.');
      }
    }

    return nextErrors;
  };

  const buildPayload = () => {
    const price = parseFloat(form.price);
    const oldPrice = form.oldPrice.trim() ? parseFloat(form.oldPrice) : undefined;

    const payload: Record<string, unknown> = {
      category: form.category,
      name: form.name,
      description: form.description,
      price,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      allergens: form.allergens.split(',').map((a) => a.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isAvailable: form.isAvailable,
      sortOrder: form.sortOrder,
    };

    if (hasLocalizedContent(form.details)) {
      payload.details = form.details;
    }

    if (form.image.trim()) {
      payload.image = form.image.trim();
    }

    if (oldPrice && !Number.isNaN(oldPrice)) {
      payload.oldPrice = oldPrice;
    }

    return payload;
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
      const payload = buildPayload();
      if (isEdit && slug) {
        await api.put(`/menu/${slug}`, payload);
      } else {
        await api.post('/menu', payload);
      }
      navigate('/admin/menu');
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  const nameError = errors.some((e) => e.startsWith('Ad'));
  const descriptionError = errors.some((e) => e.startsWith('Açıklama'));

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Menü Düzenle' : 'Yeni Menü Öğesi'}
        subtitle={isEdit ? 'Ürün bilgilerini güncelleyin' : 'Menüye yeni bir ürün ekleyin'}
        backTo="/admin/menu"
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
            <FormSection title="Temel Bilgiler" description="Ürün adı ve açıklamaları (TR, EN, FR)">
              <div className="form-group">
                <FormLabel required>Kategori</FormLabel>
                <select
                  value={form.category}
                  required
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="coffee">Kahve</option>
                  <option value="croissant">Kruvasan</option>
                  <option value="pastry">Hamur İşi</option>
                  <option value="food">Yemek</option>
                  <option value="cold">Soğuk İçecek</option>
                </select>
              </div>

              <LocalizedInput
                label="Ad"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                error={nameError}
              />
              <LocalizedInput
                label="Açıklama"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                multiline
                required
                error={descriptionError}
              />
              <LocalizedInput
                label="Detaylar"
                value={form.details}
                onChange={(v) => setForm({ ...form, details: v })}
                multiline
              />
              <span className="field-hint" style={{ display: 'block', marginTop: -8, marginBottom: 16 }}>
                Boyut / fiyat notları için — <span className="optional-badge">opsiyonel</span>
              </span>
            </FormSection>

            <FormSection title="Fiyatlandırma" description="Ürün fiyat bilgileri">
              <div className="form-row">
                <div className="form-group">
                  <FormLabel required>Fiyat (₺)</FormLabel>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <FormLabel optional>Eski Fiyat (₺)</FormLabel>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <FormLabel optional>Sıra</FormLabel>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Ek Bilgiler">
              <div className="form-group">
                <FormLabel optional>Alerjenler</FormLabel>
                <input
                  value={form.allergens}
                  onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                  placeholder="gluten, milk, eggs"
                />
                <span className="field-hint">Virgülle ayırın</span>
              </div>
            </FormSection>
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          <AdminCard title="Görsel">
            <ImageUpload value={form.image} uploading={uploading} onChange={handleUpload} optional />
          </AdminCard>

          <AdminCard title="Yayın Durumu">
            <div className="form-checks">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
                <span className="admin-toggle__text">Öne Çıkan</span>
              </label>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                />
                <span className="admin-toggle__text">Mevcut / Satışta</span>
              </label>
            </div>
          </AdminCard>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin/menu" className="btn btn-ghost">İptal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
