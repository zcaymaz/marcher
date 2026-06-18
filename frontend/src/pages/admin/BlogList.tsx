import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { BlogPost, getLocalized } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/blog/${slug}`);
    setPosts(posts.filter((p) => p.slug !== slug));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Blog Yönetimi"
        subtitle={`${posts.length} yazı`}
        action={
          <Link to="/admin/blog/new" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> Yeni Yazı
          </Link>
        }
      />

      <AdminCard noPadding>
        {posts.length === 0 ? (
          <AdminEmptyState
            icon="bi-journal-text"
            title="Henüz blog yazısı yok"
            action={
              <Link to="/admin/blog/new" className="btn btn-primary btn-sm">
                Yeni Yazı
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Kategori</th>
                  <th>Tarih</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="table-cell-title">{getLocalized(post.title, 'tr')}</td>
                    <td><AdminBadge variant="default">{post.category}</AdminBadge></td>
                    <td className="table-cell-muted">{new Date(post.date).toLocaleDateString('tr')}</td>
                    <td>
                      <AdminTableActions
                        editTo={`/admin/blog/edit/${post.slug}`}
                        onDelete={() => handleDelete(post.slug)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
