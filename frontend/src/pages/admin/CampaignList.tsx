import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Campaign, getLocalized } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';
import { CAMPAIGN_PLACEMENTS, isCampaignPlacement } from '../../constants/campaignPlacements';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/campaigns').then(({ data }) => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/campaigns/${id}`);
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Kampanya Yönetimi"
        subtitle={`${campaigns.length} kampanya`}
        action={
          <Link to="/admin/campaigns/new" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> Yeni Kampanya
          </Link>
        }
      />

      <AdminCard noPadding>
        {campaigns.length === 0 ? (
          <AdminEmptyState
            icon="bi-megaphone"
            title="Kampanya bulunamadı"
            description="Ana sayfa hero veya banner için kampanya oluşturun."
            action={
              <Link to="/admin/campaigns/new" className="btn btn-primary btn-sm">
                Yeni Kampanya
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Yerleşim</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="table-cell-title">{getLocalized(c.title, 'tr')}</td>
                    <td>
                      <AdminBadge variant="info">
                        {isCampaignPlacement(c.placement)
                          ? CAMPAIGN_PLACEMENTS[c.placement].shortLabel
                          : c.placement}
                      </AdminBadge>
                    </td>
                    <td>
                      <AdminBadge variant={c.isActive ? 'success' : 'default'} dot>
                        {c.isActive ? 'Aktif' : 'Pasif'}
                      </AdminBadge>
                    </td>
                    <td>
                      <AdminTableActions
                        editTo={`/admin/campaigns/edit/${c.id}`}
                        onDelete={() => handleDelete(c.id)}
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
