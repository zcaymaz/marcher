import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FranchiseInquiry } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminDetailDrawer from '../../components/admin/AdminDetailDrawer';
import StatusBadgeSelect, { FranchiseStatus } from '../../components/admin/StatusBadgeSelect';

export default function FranchiseList() {
  const [inquiries, setInquiries] = useState<FranchiseInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FranchiseInquiry | null>(null);

  useEffect(() => {
    api.get('/franchise').then(({ data }) => {
      setInquiries(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: FranchiseStatus) => {
    await api.put(`/franchise/${id}/status`, { status });
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/franchise/${id}`);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const newCount = inquiries.filter((i) => i.status === 'NEW').length;

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Franchise Başvuruları"
        subtitle={`${inquiries.length} başvuru${newCount > 0 ? ` · ${newCount} yeni` : ''}`}
      />

      <AdminCard noPadding>
        {inquiries.length === 0 ? (
          <AdminEmptyState
            icon="bi-building"
            title="Henüz başvuru yok"
            description="Franchise formundan gelen başvurular burada listelenir."
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>E-posta</th>
                  <th>Şehir</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="admin-table-row--clickable"
                    onClick={() => setSelected(inq)}
                  >
                    <td className="table-cell-title">{inq.name}</td>
                    <td className="table-cell-muted">{inq.email}</td>
                    <td className="table-cell-muted">{inq.city || '—'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusBadgeSelect
                        value={inq.status}
                        onChange={(status) => updateStatus(inq.id, status)}
                      />
                    </td>
                    <td className="table-cell-muted">
                      {new Date(inq.createdAt).toLocaleDateString('tr')}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <AdminTableActions
                        onView={() => setSelected(inq)}
                        onDelete={() => handleDelete(inq.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminDetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle={
          selected
            ? new Date(selected.createdAt).toLocaleString('tr', {
                dateStyle: 'long',
                timeStyle: 'short',
              })
            : undefined
        }
        footer={
          selected && (
            <div className="admin-drawer__footer-actions">
              <StatusBadgeSelect
                value={selected.status}
                onChange={(status) => updateStatus(selected.id, status)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelected(null)}
              >
                Kapat
              </button>
            </div>
          )
        }
      >
        {selected && (
          <dl className="admin-detail-list">
            <div className="admin-detail-item">
              <dt>E-posta</dt>
              <dd>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </dd>
            </div>
            {selected.phone && (
              <div className="admin-detail-item">
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${selected.phone.replace(/\s/g, '')}`}>{selected.phone}</a>
                </dd>
              </div>
            )}
            <div className="admin-detail-item">
              <dt>Şehir</dt>
              <dd>{selected.city || '—'}</dd>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <dt>Mesaj / Açıklama</dt>
              <dd className="admin-detail-message">{selected.message}</dd>
            </div>
          </dl>
        )}
      </AdminDetailDrawer>
    </div>
  );
}
