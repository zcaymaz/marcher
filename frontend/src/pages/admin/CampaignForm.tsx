import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { emptyLocalized, getLocalized } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import FormSection from '../../components/admin/FormSection';
import FormRequiredNote from '../../components/admin/FormRequiredNote';
import FormLabel from '../../components/admin/FormLabel';
import ImageUpload from '../../components/admin/ImageUpload';
import CampaignPlacementPreview from '../../components/admin/CampaignPlacementPreview';
import {
  CAMPAIGN_PLACEMENTS,
  CampaignPlacement,
  isCampaignPlacement,
} from '../../constants/campaignPlacements';
import {
  HERO_CUSTOM_LINK,
  HERO_LINK_OPTIONS,
  resolveHeroLinkPreset,
} from '../../constants/heroLinkOptions';
import { localizedFieldErrors, parseApiErrors } from '../../utils/formValidation';

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
    placement: 'HOME_HERO' as CampaignPlacement,
    sortOrder: 0,
    startDate: '',
    endDate: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [heroImageAlt, setHeroImageAlt] = useState('');
  const [heroLinkPreset, setHeroLinkPreset] = useState('/menu');
  const [heroCustomLink, setHeroCustomLink] = useState('');

  const placementConfig = CAMPAIGN_PLACEMENTS[form.placement];
  const isHeroPlacement = form.placement === 'HOME_HERO';

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/campaigns/${id}`).then(({ data }) => {
        const placement = isCampaignPlacement(data.placement) ? data.placement : 'HOME_HERO';
        setForm({
          ...data,
          placement,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          subtitle: data.subtitle || emptyLocalized(),
          ctaText: data.ctaText || emptyLocalized(),
        });
        if (placement === 'HOME_HERO') {
          setHeroImageAlt(data.title?.tr || '');
          const preset = resolveHeroLinkPreset(data.ctaLink || '/menu');
          setHeroLinkPreset(preset);
          if (preset === HERO_CUSTOM_LINK) {
            setHeroCustomLink(data.ctaLink || '');
          }
        }
      });
    }
  }, [id, isEdit]);

  const handlePlacementChange = (placement: CampaignPlacement) => {
    setForm((prev) => ({ ...prev, placement }));
    setErrors([]);
    if (placement === 'HOME_HERO') {
      setHeroLinkPreset(resolveHeroLinkPreset(form.ctaLink || '/menu'));
    }
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

  const validate = (): string[] => {
    const nextErrors: string[] = [];

    if (isHeroPlacement) {
      if (!form.image.trim()) {
        nextErrors.push('Hero slaytı için görsel zorunludur.');
      }
      const link =
        heroLinkPreset === HERO_CUSTOM_LINK ? heroCustomLink.trim() : heroLinkPreset;
      if (!link) {
        nextErrors.push('Yönlendirme linki zorunludur.');
      }
    } else {
      nextErrors.push(...localizedFieldErrors(form.title, 'Başlık'));

      if (placementConfig.required.subtitle) {
        nextErrors.push(...localizedFieldErrors(form.subtitle, 'Alt Başlık'));
      }
      if (placementConfig.required.ctaText) {
        nextErrors.push(...localizedFieldErrors(form.ctaText, 'CTA Metni'));
      }
      if (placementConfig.required.image && !form.image.trim()) {
        nextErrors.push('Bu yerleşim için görsel zorunludur.');
      }
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      nextErrors.push('Bitiş tarihi başlangıçtan önce olamaz.');
    }

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
      const heroLink =
        heroLinkPreset === HERO_CUSTOM_LINK ? heroCustomLink.trim() : heroLinkPreset;
      const heroTitle = heroImageAlt.trim() || 'Marcher Coffee';
      const payload = isHeroPlacement
        ? {
            ...form,
            title: { tr: heroTitle, en: heroTitle, fr: heroTitle },
            subtitle: undefined,
            ctaText: undefined,
            ctaLink: heroLink,
            startDate: form.startDate || undefined,
            endDate: form.endDate || undefined,
          }
        : {
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
    } catch (error) {
      setErrors(parseApiErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  const previewTitle = getLocalized(form.title, 'tr') || undefined;

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Kampanya Düzenle' : 'Yeni Kampanya'}
        subtitle={placementConfig.description}
        backTo="/admin/campaigns"
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
          <AdminCard title="Yerleşim" subtitle="Kampanyanın sitede nerede görüneceğini seçin">
            <div className="form-group">
              <FormLabel required>Yerleşim</FormLabel>
              <select
                value={form.placement}
                onChange={(e) => handlePlacementChange(e.target.value as CampaignPlacement)}
              >
                {(Object.keys(CAMPAIGN_PLACEMENTS) as CampaignPlacement[]).map((key) => (
                  <option key={key} value={key}>
                    {CAMPAIGN_PLACEMENTS[key].label}
                  </option>
                ))}
              </select>
            </div>
            <CampaignPlacementPreview placement={form.placement} title={previewTitle} />
          </AdminCard>

          <AdminCard>
            <FormSection
              title={isHeroPlacement ? 'Hero Slayt' : 'İçerik'}
              description={
                isHeroPlacement
                  ? 'Görsel tıklandığında yönlendirilecek sayfayı seçin'
                  : form.placement === 'HOME_BANNER'
                    ? 'Duyuru çubuğunda gösterilecek kısa metin'
                    : 'Kampanya metinleri (TR, EN, FR)'
              }
            >
              {isHeroPlacement ? (
                <>
                  <div className="form-group">
                    <FormLabel required>Yönlendirme</FormLabel>
                    <select
                      value={heroLinkPreset}
                      onChange={(e) => setHeroLinkPreset(e.target.value)}
                    >
                      {HERO_LINK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      <option value={HERO_CUSTOM_LINK}>Özel URL</option>
                    </select>
                    <span className="field-hint">Görsele tıklandığında gidilecek sayfa</span>
                  </div>

                  {heroLinkPreset === HERO_CUSTOM_LINK && (
                    <div className="form-group">
                      <FormLabel required>Özel URL</FormLabel>
                      <input
                        value={heroCustomLink}
                        onChange={(e) => setHeroCustomLink(e.target.value)}
                        placeholder="/menu veya https://..."
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <FormLabel optional>Görsel açıklaması</FormLabel>
                    <input
                      value={heroImageAlt}
                      onChange={(e) => setHeroImageAlt(e.target.value)}
                      placeholder="Erişilebilirlik için kısa açıklama"
                    />
                    <span className="field-hint">Ekran okuyucular için kullanılır</span>
                  </div>
                </>
              ) : (
                <>
                  <LocalizedInput
                    label="Başlık"
                    value={form.title}
                    onChange={(v) => setForm({ ...form, title: v })}
                    required
                    error={errors.some((e) => e.startsWith('Başlık'))}
                  />

                  {placementConfig.fields.subtitle && (
                    <LocalizedInput
                      label="Alt Başlık"
                      value={form.subtitle}
                      onChange={(v) => setForm({ ...form, subtitle: v })}
                      required={placementConfig.required.subtitle}
                      error={errors.some((e) => e.startsWith('Alt Başlık'))}
                    />
                  )}

                  {placementConfig.fields.ctaText && (
                    <LocalizedInput
                      label="CTA Metni"
                      value={form.ctaText}
                      onChange={(v) => setForm({ ...form, ctaText: v })}
                      required={placementConfig.required.ctaText}
                      error={errors.some((e) => e.startsWith('CTA Metni'))}
                    />
                  )}

                  {placementConfig.fields.ctaLink && (
                    <div className="form-group">
                      <FormLabel optional>CTA Link</FormLabel>
                      <input
                        value={form.ctaLink}
                        onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                        placeholder="/menu"
                      />
                      <span className="field-hint">Butona tıklandığında gidilecek sayfa</span>
                    </div>
                  )}
                </>
              )}
            </FormSection>

            {placementConfig.fields.schedule && (
              <FormSection title="Zamanlama" description="Boş bırakılırsa süresiz yayınlanır">
                <div className="form-row">
                  <div className="form-group">
                    <FormLabel optional>Başlangıç</FormLabel>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <FormLabel optional>Bitiş</FormLabel>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </FormSection>
            )}
          </AdminCard>
        </div>

        <div className="admin-form-sidebar">
          {placementConfig.fields.image && (
            <AdminCard
              title="Görsel"
              subtitle={placementConfig.required.image ? 'Zorunlu alan' : 'İsteğe bağlı'}
            >
              <ImageUpload
                value={form.image}
                uploading={uploading}
                onChange={handleUpload}
                required={placementConfig.required.image}
                optional={!placementConfig.required.image}
                error={errors.some((e) => e.includes('görsel'))}
              />
            </AdminCard>
          )}

          <AdminCard title="Yayın Ayarları">
            <div className="form-group">
              <FormLabel optional>Sıra</FormLabel>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
              />
              <span className="field-hint">Aynı yerleşimde düşük sayı önce gösterilir</span>
            </div>
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="admin-toggle__text">Aktif kampanya</span>
            </label>
          </AdminCard>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin/campaigns" className="btn btn-ghost">
              İptal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
