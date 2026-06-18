import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalized, Campaign } from '../../types';
import { getImageUrl } from '../../utils/api';

const HERO_FALLBACK_IMAGE = '/images/hero-default.png';
const AUTO_PLAY_MS = 6500;

interface HeroCarouselProps {
  campaigns: Campaign[];
}

function isExternalLink(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function HeroSlideLink({
  to,
  children,
  ariaLabel,
}: {
  to: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  if (isExternalLink(to)) {
    return (
      <a
        href={to}
        className="hero-slide-link"
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className="hero-slide-link" aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export default function HeroCarousel({ campaigns }: HeroCarouselProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [current, setCurrent] = useState(0);

  const slides =
    campaigns.length > 0
      ? campaigns
      : [
          {
            id: 'default',
            title: {
              tr: t('home.hero_title_full'),
              en: t('home.hero_title_full'),
              fr: t('home.hero_title_full'),
            },
            ctaLink: '/menu',
            image: undefined,
            isActive: true,
            placement: 'HOME_HERO',
            sortOrder: 0,
          } as Campaign,
        ];

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % total);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="hero-carousel" aria-label={t('home.hero_carousel_label')}>
      <div className="hero-slides-track">
        {slides.map((slide, index) => {
          const isActive = index === current;
          const imageSrc = slide.image ? getImageUrl(slide.image) : HERO_FALLBACK_IMAGE;
          const altText = getLocalized(slide.title, lang) || t('home.hero_carousel_label');
          const link = slide.ctaLink?.trim() || '/menu';

          return (
            <div
              key={slide.id}
              className={`hero-slide-layer${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <HeroSlideLink to={link} ariaLabel={altText}>
                <img
                  src={imageSrc}
                  alt={altText}
                  className="hero-slide-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </HeroSlideLink>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className="carousel-btn carousel-btn--prev"
            onClick={prev}
            aria-label={t('home.carousel_prev')}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            type="button"
            className="carousel-btn carousel-btn--next"
            onClick={next}
            aria-label={t('home.carousel_next')}
          >
            <i className="bi bi-chevron-right" />
          </button>
          <div className="carousel-dots" role="tablist">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === current}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`${t('home.carousel_slide')} ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
