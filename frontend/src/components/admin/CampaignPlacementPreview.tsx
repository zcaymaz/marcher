import { CAMPAIGN_PLACEMENTS, CampaignPlacement } from '../../constants/campaignPlacements';

interface Props {
  placement: CampaignPlacement;
  title?: string;
}

export default function CampaignPlacementPreview({ placement, title }: Props) {
  const config = CAMPAIGN_PLACEMENTS[placement];

  return (
    <div className="placement-preview">
      <div className="placement-preview__label">
        <i className="bi bi-eye" />
        Önizleme — {config.shortLabel}
      </div>

      {config.preview === 'banner' && (
        <div className="placement-preview__mock placement-preview__mock--banner">
          <div className="placement-preview__bar">
            {title || 'Duyuru metni burada görünür'}
          </div>
          <div className="placement-preview__chrome">
            <span className="placement-preview__dot" />
            <span className="placement-preview__line" />
          </div>
        </div>
      )}

      {config.preview === 'hero' && (
        <div className="placement-preview__mock placement-preview__mock--hero">
          <div className="placement-preview__chrome">
            <span className="placement-preview__dot" />
            <span className="placement-preview__line" />
          </div>
          <div className="placement-preview__hero placement-preview__hero--image-only">
            <div className="placement-preview__hero-image" />
          </div>
        </div>
      )}

      {config.preview === 'menu' && (
        <div className="placement-preview__mock placement-preview__mock--menu">
          <div className="placement-preview__menu-banner">
            {title || 'Menü banner metni'}
          </div>
          <div className="placement-preview__menu-chips">
            <span>Tümü</span>
            <span>Kahve</span>
            <span>Kruvasan</span>
          </div>
          <div className="placement-preview__menu-row" />
          <div className="placement-preview__menu-row" />
        </div>
      )}

      <p className="placement-preview__hint">{config.hint}</p>
    </div>
  );
}
