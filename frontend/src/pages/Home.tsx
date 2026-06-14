import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { getLocalized } from '../types';
import { Campaign, MenuItem, BlogPost, Review, Reference } from '../types';
import SEO from '../components/common/SEO';

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
      setReferences(refs.data.slice(0, 6));
    });
  }, []);

  const hero = campaigns[0];

  return (
    <>
      <SEO description="Marcher Coffee Paris - Kruvasan ve kahve deneyimi" />

      <section className="hero">
        <div className="container hero-content">
          <span className="hero-badge">Paris</span>
          <h1>{hero ? getLocalized(hero.title, lang) : 'Marcher Coffee Paris'}</h1>
          <p>{hero ? getLocalized(hero.subtitle, lang) : t('about.subtitle')}</p>
          <Link to={hero?.ctaLink || '/menu'} className="btn btn-primary">
            {hero ? getLocalized(hero.ctaText, lang) : t('home.hero_cta')}
          </Link>
        </div>
        {hero?.image && (
          <div className="hero-image" style={{ backgroundImage: `url(${getImageUrl(hero.image)})` }} />
        )}
      </section>

      <section className="section featured-section">
        <div className="container">
          <h2>{t('home.featured')}</h2>
          <div className="card-grid">
            {featured.map((item) => (
              <Link to={`/menu/${item.slug}`} key={item.id} className="menu-card">
                {item.image && <img src={getImageUrl(item.image)} alt="" />}
                <div className="menu-card-body">
                  <h3>{getLocalized(item.name, lang)}</h3>
                  <p>{getLocalized(item.description, lang)}</p>
                  <span className="price">{item.price.toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section blog-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('home.blog_title')}</h2>
            <Link to="/blog">{t('home.view_all')}</Link>
          </div>
          <div className="card-grid">
            {blogs.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card">
                {post.image && <img src={getImageUrl(post.image)} alt="" />}
                <div className="blog-card-body">
                  <span className="category">{post.category}</span>
                  <h3>{getLocalized(post.title, lang)}</h3>
                  <p>{getLocalized(post.excerpt, lang)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <h2>{t('home.reviews_title')}</h2>
          <div className="reviews-grid">
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
            <h2>{t('home.references_title')}</h2>
            <Link to="/references">{t('home.view_all')}</Link>
          </div>
          <div className="references-grid">
            {references.map((ref) => (
              <div key={ref.id} className="reference-card">
                {(ref.logo || ref.image) && (
                  <img src={getImageUrl(ref.logo || ref.image)} alt={getLocalized(ref.name, lang)} />
                )}
                <span>{getLocalized(ref.name, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
