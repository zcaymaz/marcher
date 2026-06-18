import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../utils/api';
import { Reference, getLocalized } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';

export default function ReferenceList() {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/references').then(({ data }) => {
      setRefs(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/references/${slug}`);
    setRefs(refs.filter((r) => r.slug !== slug));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Referans Yönetimi"
        subtitle={`${refs.length} referans`}
        action={
          <Link to="/admin/references/new" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> Yeni Referans
          </Link>
        }
      />

      <AdminCard noPadding>
        {refs.length === 0 ? (
          <AdminEmptyState
            icon="bi-images"
            title="Henüz referans yok"
            action={
              <Link to="/admin/references/new" className="btn btn-primary btn-sm">
                Yeni Referans
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Ad</th>
                  <th>Tip</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {refs.map((ref) => (
                  <tr key={ref.id}>
                    <td>
                      {(ref.logo || ref.image) ? (
                        <img src={getImageUrl(ref.logo || ref.image)} alt="" className="table-thumb" />
                      ) : (
                        <div className="table-thumb" style={{ background: 'var(--grey-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-image" style={{ color: 'var(--grey-400)' }} />
                        </div>
                      )}
                    </td>
                    <td className="table-cell-title">{getLocalized(ref.name, 'tr')}</td>
                    <td><AdminBadge variant="default">{ref.type}</AdminBadge></td>
                    <td>
                      <AdminTableActions
                        editTo={`/admin/references/edit/${ref.slug}`}
                        onDelete={() => handleDelete(ref.slug)}
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
