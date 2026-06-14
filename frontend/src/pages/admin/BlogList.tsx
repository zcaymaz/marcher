import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { BlogPost, getLocalized } from '../../types';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.get('/blog').then(({ data }) => setPosts(data));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/blog/${slug}`);
    setPosts(posts.filter((p) => p.slug !== slug));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Blog Yönetimi</h1>
        <Link to="/admin/blog/new" className="btn btn-primary">Yeni Yazı</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Başlık</th><th>Kategori</th><th>Tarih</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{getLocalized(post.title, 'tr')}</td>
              <td>{post.category}</td>
              <td>{new Date(post.date).toLocaleDateString('tr')}</td>
              <td className="actions">
                <Link to={`/admin/blog/edit/${post.slug}`}>Düzenle</Link>
                <button onClick={() => handleDelete(post.slug)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
