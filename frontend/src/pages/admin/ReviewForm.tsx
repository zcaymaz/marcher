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
import { localizedFieldErrors, parseApiErrors } from '../../utils/formValidation';

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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/reviews/${id}`).then(({ data }) => setForm(data));
    }
  }, [id, isEdit]);

  const validate = (): string[] => {
    const nextErrors: string[] = [];

    if (!form.authorName.trim()) {
      nextErrors.push('Yazar adı zorunludur.');
    }

    if (!form.rating || form.rating < 1 || form.rating > 5) {
      nextErrors.push('Puan 1 ile 5 arasında olmalıdır.');
    }

    if (form.source === 'GOOGLE' && !form.googleReviewId.trim()) {
      nextErrors.push('Google kaynağı için Review ID zorunludur.');
    }

    nextErrors.push(...localizedFieldErrors(form.text, 'Yorum Metni'));

    return nextErrors;
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
      if (isEdit && id) {
        await api.put(`/reviews/${id}`, form);
      } else {
        await api.post('/reviews', form);
      }
      navigate('/admin/reviews');
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Yorum Düzenle' : 'Yeni Yorum'}
        subtitle="Müşteri yorumu ekleyin veya düzenleyin"
        backTo="/admin/reviews"
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
            <FormSection title="Yorum Detayları">
              <div className="form-group">
                <FormLabel required>Yazar Adı</FormLabel>
                <input
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  placeholder="Sophie Martin"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <FormLabel required>Puan (1-5)</FormLabel>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) || 5 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <FormLabel required>Kaynak</FormLabel>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value as 'MANUAL' | 'GOOGLE' })}
                  >
                    <option value="MANUAL">Manuel</option>
                    <option value="GOOGLE">Google</option>
                  </select>
                </div>
              </div>
              {form.source === 'GOOGLE' && (
                <div className="form-group">
                  <FormLabel required>Google Review ID</FormLabel>
                  <input
                    value={form.googleReviewId}
                    onChange={(e) => setForm({ ...form, googleReviewId: e.target.value })}
                    placeholder="ChZDSUhNMG9nS0V..."
                  />
                </div>
              )}
              <LocalizedInput
                label="Yorum Metni"
                value={form.text}
                onChange={(v) => setForm({ ...form, text: v })}
                multiline
                required
                error={errors.some((e) => e.startsWith('Yorum Metni'))}
              />
            </FormSection>
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          <AdminCard title="Yayın">
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              />
              <span className="admin-toggle__text">Sitede görünür</span>
            </label>
            <div className="form-group" style={{ marginTop: 16 }}>
              <FormLabel optional>Sıra</FormLabel>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </AdminCard>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin/reviews" className="btn btn-ghost">İptal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
