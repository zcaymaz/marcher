import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { emptyLocalized, SiteSettings } from '../../types';
import LocalizedInput from '../../components/admin/LocalizedInput';

export default function SiteSettingsPage() {
  const [form, setForm] = useState({
    whatsappNumber: '',
    phone: '',
    email: '',
    address: emptyLocalized(),
    googleMapsEmbedUrl: '',
    googlePlaceId: '',
    socialLinks: { instagram: '', facebook: '' },
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/site-settings').then(({ data }: { data: SiteSettings }) => {
      setForm({
        whatsappNumber: data.whatsappNumber || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || emptyLocalized(),
        googleMapsEmbedUrl: data.googleMapsEmbedUrl || '',
        googlePlaceId: data.googlePlaceId || '',
        socialLinks: {
          instagram: data.socialLinks?.instagram || '',
          facebook: data.socialLinks?.facebook || '',
        },
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put('/site-settings', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1>Site Ayarları</h1>
      {saved && <div className="success-message">Kaydedildi!</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>WhatsApp Numarası</label>
          <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Telefon</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <LocalizedInput label="Adres" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
        <div className="form-group">
          <label>Google Maps Embed URL</label>
          <input value={form.googleMapsEmbedUrl} onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Google Place ID (API için)</label>
          <input value={form.googlePlaceId} onChange={(e) => setForm({ ...form, googlePlaceId: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Instagram</label>
            <input value={form.socialLinks.instagram} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
          </div>
          <div className="form-group">
            <label>Facebook</label>
            <input value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
