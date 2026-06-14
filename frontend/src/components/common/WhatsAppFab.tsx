import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function WhatsAppFab() {
  const { settings } = useSettings();
  const { t } = useTranslation();

  if (!settings?.whatsappNumber) return null;

  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(t('whatsapp.message'))}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-fab" aria-label="WhatsApp">
      <i className="bi bi-whatsapp"></i>
    </a>
  );
}
