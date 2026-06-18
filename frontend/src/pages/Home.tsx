import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { formatPrice } from '../utils/formatPrice';
import { getLocalized } from '../types';
import { Campaign, MenuItem, BlogPost, Review, Reference } from '../types';
import SEO from '../components/common/SEO';
import HeroCarousel from '../components/home/HeroCarousel';
import ReferencesLogoCarousel from '../components/home/ReferencesLogoCarousel';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/campaigns/active?placement=HOME_HERO'),
      api.get('/menu?available=true'),
      api.get('/blog'),
      api.get('/reviews?visible=true'),
      api.get('/references'),
    ]).then(([camp, menu, blog, rev, refs]) => {
      setCampaigns(camp.data);
      setFeatured(menu.data.filter((m: MenuItem) => m.isFeatured).slice(0, 4));
      setBlogs(blog.data.slice(0, 3));
      setReviews(rev.data.slice(0, 3));
      setReferences(refs.data);
    });
  }, []);

  return (
    <>
      <SEO description={t('home.seo_description')} />

      <HeroCarousel campaigns={campaigns} />

      <section className="section featured-section">
        <div className="container featured-container">
          <h2 className="featured-title">{t('home.featured')}</h2>

          <div className="featured-grid">
            {featured.slice(0, 3).map((item) => (
              <Link to={`/menu/${item.slug}`} key={item.id} className="product-card">
                <div className="product-card-image">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={getLocalized(item.name, lang)} />
                  ) : (
                    <div className="product-card-placeholder" aria-hidden="true" />
                  )}
                </div>
                <h3 className="product-card-name">{getLocalized(item.name, lang)}</h3>
                <p className="product-card-price">
                  {formatPrice(item.price)}
                </p>
              </Link>
            ))}
          </div>

          <div className="featured-footer">
            <Link to="/menu" className="btn-view-all">
              {t('home.view_all')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section blog-section">
        <div className="container blog-container">
          <h2 className="blog-section-title">{t('home.blog_title')}</h2>

          <div className="blog-grid">
            {blogs.map((post) => (
              <article key={post.id} className="blog-post-card">
                <Link to={`/blog/${post.slug}`} className="blog-post-image-link">
                  {post.image ? (
                    <img
                      src={getImageUrl(post.image)}
                      alt={getLocalized(post.title, lang)}
                      className="blog-post-image"
                    />
                  ) : (
                    <div className="blog-post-image blog-post-image--placeholder" aria-hidden="true" />
                  )}
                </Link>
                <div className="blog-post-body">
                  <h3 className="blog-post-title">
                    <Link to={`/blog/${post.slug}`}>{getLocalized(post.title, lang)}</Link>
                  </h3>
                  <p className="blog-post-excerpt">{getLocalized(post.excerpt, lang)}</p>
                  <Link to={`/blog/${post.slug}`} className="btn-read-more">
                    {t('blog.read_more')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <span className="section-overline">{t('home.reviews_overline')}</span>
          <h2>{t('home.reviews_title')}</h2>
          <div className="reviews-grid section-body">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-stars">
                  {'★'.repeat(review.rating)}
                </div>
                <p>"{getLocalized(review.text, lang)}"</p>
                <span className="review-author">— {review.authorName}</span>
                {review.source === 'GOOGLE' && <span className="google-badge">Google</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section references-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-overline">{t('home.references_overline')}</span>
              <h2>{t('home.references_title')}</h2>
            </div>
            <Link to="/references" className="section-link">{t('home.view_all')}</Link>
          </div>
          <ReferencesLogoCarousel references={references} />
        </div>
      </section>
    </>
  );
}
