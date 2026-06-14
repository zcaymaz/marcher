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

  useEffect(() => {
    api.get('/blog').then(({ data }) => setPosts(data));
  }, []);

  return (
    <>
      <SEO title={t('blog.title')} />
      <div className="page-container">
        <h1>{t('blog.title')}</h1>
        <div className="card-grid">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card">
              {post.image && <img src={getImageUrl(post.image)} alt="" />}
              <div className="blog-card-body">
                <span className="category">{post.category}</span>
                <h3>{getLocalized(post.title, lang)}</h3>
                <p>{getLocalized(post.excerpt, lang)}</p>
                <span className="read-more">{t('blog.read_more')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
