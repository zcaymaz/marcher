import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { getLocalized, BlogPost } from '../types';
import SEO from '../components/common/SEO';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/blog')
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title={t('blog.title')} />
      <div className="blog-page">
        <div className="container blog-page__inner">
          <header className="blog-page__header">
            <h1 className="blog-section-title">{t('blog.title')}</h1>
          </header>

          {loading ? (
            <p className="blog-page__loading">{t('common.loading')}</p>
          ) : posts.length === 0 ? (
            <p className="blog-page__empty">{t('blog.empty', 'Henüz blog yazısı yok.')}</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
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
                    <span className="category">{post.category}</span>
                    <h2 className="blog-post-title">
                      <Link to={`/blog/${post.slug}`}>{getLocalized(post.title, lang)}</Link>
                    </h2>
                    <p className="blog-post-excerpt">{getLocalized(post.excerpt, lang)}</p>
                    <Link to={`/blog/${post.slug}`} className="btn-read-more">
                      {t('blog.read_more')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
