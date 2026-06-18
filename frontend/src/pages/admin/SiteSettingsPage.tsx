import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { emptyLocalized, SiteSettings } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import FormSection from '../../components/admin/FormSection';
import FormRequiredNote from '../../components/admin/FormRequiredNote';
import FormLabel from '../../components/admin/FormLabel';
import { localizedFieldErrors, parseApiErrors } from '../../utils/formValidation';

function cleanSocialLinks(links: { instagram: string; facebook: string }) {
  const result: Record<string, string> = {};
  if (links.instagram.trim()) result.instagram = links.instagram.trim();
  if (links.facebook.trim()) result.facebook = links.facebook.trim();
  return result;
}

export default function SiteSettingsPage() {
  const [form, setForm] = useState({
    whatsappNumber: '',
    phone: '',
    email: '',
    address: emptyLocalized(),
    addressUrl: '',
    googleMapsEmbedUrl: '',
    googlePlaceId: '',
    socialLinks: { instagram: '', facebook: '' },
  });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    api.get('/site-settings').then(({ data }: { data: SiteSettings }) => {
      setForm({
        whatsappNumber: data.whatsappNumber || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || emptyLocalized(),
        addressUrl: data.addressUrl || '',
        googleMapsEmbedUrl: data.googleMapsEmbedUrl || '',
        googlePlaceId: data.googlePlaceId || '',
        socialLinks: {
          instagram: data.socialLinks?.instagram || '',
          facebook: data.socialLinks?.facebook || '',
        },
      });
    });
  }, []);

  const validate = (): string[] => {
    const nextErrors: string[] = [];

    if (!form.whatsappNumber.trim()) {
      nextErrors.push('WhatsApp numarası zorunludur.');
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.push('Geçerli bir e-posta adresi girin.');
    }

    if (form.addressUrl.trim()) {
      try {
        new URL(form.addressUrl.trim());
      } catch {
        nextErrors.push('Lokasyon linki geçerli bir URL olmalıdır.');
      }
    }

    nextErrors.push(...localizedFieldErrors(form.address, 'Adres'));

    return nextErrors;
  };

  const buildPayload = () => ({
    whatsappNumber: form.whatsappNumber.trim(),
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
    address: form.address,
    addressUrl: form.addressUrl.trim() || undefined,
    googleMapsEmbedUrl: form.googleMapsEmbedUrl.trim() || undefined,
    googlePlaceId: form.googlePlaceId.trim() || undefined,
    socialLinks: cleanSocialLinks(form.socialLinks),
  });

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
      await api.put('/site-settings', buildPayload());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  const addressError = errors.some((e) => e.startsWith('Adres'));

  return (
    <div>
      <AdminPageHeader
        title="Site Ayarları"
        subtitle="İletişim bilgileri ve entegrasyon ayarları"
      />

      <FormRequiredNote />

      {saved && <div className="success-message" style={{ marginBottom: 20 }}>Ayarlar kaydedildi!</div>}

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
            <FormSection title="İletişim Bilgileri" description="Sitede görüntülenecek iletişim detayları">
              <div className="form-group">
                <FormLabel required>WhatsApp Numarası</FormLabel>
                <input
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="905339170698"
                  required
                />
                <span className="field-hint">Ülke kodu ile, boşluksuz (ör. 905339170698)</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <FormLabel optional>Telefon</FormLabel>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+33 1 00 00 00 00"
                  />
                </div>
                <div className="form-group">
                  <FormLabel optional>E-posta</FormLabel>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="paris@marchercoffee.com"
                  />
                </div>
              </div>

              <LocalizedInput
                label="Adres"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                multiline
                required
                error={addressError}
              />

              <div className="form-group">
                <FormLabel optional>Lokasyon linki</FormLabel>
                <input
                  type="url"
                  value={form.addressUrl}
                  onChange={(e) => setForm({ ...form, addressUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=Marcher+Coffee+Paris"
                />
                <span className="field-hint">
                  Footer&apos;daki adres metnine tıklandığında açılacak harita veya konum sayfası
                </span>
              </div>
            </FormSection>

            <FormSection title="Sosyal Medya" description="Footer ve sitede görünecek profil linkleri">
              <div className="form-row">
                <div className="form-group">
                  <FormLabel optional>Instagram</FormLabel>
                  <input
                    value={form.socialLinks.instagram}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/marchercoffee"
                  />
                </div>
                <div className="form-group">
                  <FormLabel optional>Facebook</FormLabel>
                  <input
                    value={form.socialLinks.facebook}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/marchercoffee"
                  />
                </div>
              </div>
            </FormSection>
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          <AdminCard title="Google Entegrasyonu">
            <div className="form-group">
              <FormLabel optional>Maps Embed URL</FormLabel>
              <input
                value={form.googleMapsEmbedUrl}
                onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
            <div className="form-group">
              <FormLabel optional>Place ID</FormLabel>
              <input
                value={form.googlePlaceId}
                onChange={(e) => setForm({ ...form, googlePlaceId: e.target.value })}
                placeholder="ChIJ..."
              />
            </div>
          </AdminCard>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
