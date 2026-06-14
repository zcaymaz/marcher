import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../utils/api';
import { getLocalized, BlogPost } from '../types';
import SEO from '../components/common/SEO';

export default function BlogDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) api.get(`/blog/${slug}`).then(({ data }) => setPost(data));
  }, [slug]);

  if (!post) return <p className="loading-text">{t('common.loading')}</p>;

  return (
    <>
      <SEO title={getLocalized(post.title, lang)} />
      <article className="page-container blog-detail">
        <Link to="/blog" className="back-link">
          <i className="bi bi-arrow-left"></i> {t('common.back')}
        </Link>
        {post.image && <img src={getImageUrl(post.image)} alt="" className="blog-hero-image" />}
        <span className="category">{post.category}</span>
        <h1>{getLocalized(post.title, lang)}</h1>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: getLocalized(post.content, lang) }}
        />
      </article>
    </>
  );
}
