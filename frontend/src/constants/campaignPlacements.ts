export type CampaignPlacement = 'HOME_HERO' | 'HOME_BANNER' | 'MENU_BANNER';

export interface PlacementConfig {
  label: string;
  shortLabel: string;
  description: string;
  hint: string;
  preview: 'hero' | 'banner' | 'menu';
  fields: {
    subtitle: boolean;
    ctaText: boolean;
    ctaLink: boolean;
    image: boolean;
    schedule: boolean;
  };
  required: {
    title: boolean;
    subtitle: boolean;
    ctaText: boolean;
    image: boolean;
  };
}

export const CAMPAIGN_PLACEMENTS: Record<CampaignPlacement, PlacementConfig> = {
  HOME_HERO: {
    label: 'Ana Sayfa Hero',
    shortLabel: 'Hero slayt',
    description: 'Ana sayfadaki tam genişlik görsel slayt alanında gösterilir.',
    hint: 'Tam genişlik banner görseli kullanın (önerilen: 1920×1080 px, 16:9). Görsel kırpılmadan gösterilir; kenar boşluğu bırakmayın.',
    preview: 'hero',
    fields: { subtitle: false, ctaText: false, ctaLink: true, image: true, schedule: true },
    required: { title: false, subtitle: false, ctaText: false, image: true },
  },
  HOME_BANNER: {
    label: 'Ana Sayfa Banner',
    shortLabel: 'Üst duyuru',
    description: 'Sitenin en üstündeki ince duyuru çubuğunda gösterilir.',
    hint: 'Yalnızca başlık metni kullanılır. Alt başlık, CTA ve görsel bu yerleşimde gösterilmez.',
    preview: 'banner',
    fields: { subtitle: false, ctaText: false, ctaLink: false, image: false, schedule: true },
    required: { title: true, subtitle: false, ctaText: false, image: false },
  },
  MENU_BANNER: {
    label: 'Menü Banner',
    shortLabel: 'QR menü banner',
    description: 'QR menü sayfasının üst kısmında gösterilir.',
    hint: 'Başlık ve isteğe bağlı görsel kullanılır. Alt başlık ve CTA bu yerleşimde gösterilmez.',
    preview: 'menu',
    fields: { subtitle: true, ctaText: false, ctaLink: false, image: true, schedule: true },
    required: { title: true, subtitle: false, ctaText: false, image: false },
  },
};

export function isCampaignPlacement(value: string): value is CampaignPlacement {
  return value in CAMPAIGN_PLACEMENTS;
}
