import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Campaign, getLocalized } from '../../types';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api.get('/campaigns').then(({ data }) => setCampaigns(data));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/campaigns/${id}`);
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Kampanya Yönetimi</h1>
        <Link to="/admin/campaigns/new" className="btn btn-primary">Yeni Kampanya</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Başlık</th><th>Yerleşim</th><th>Durum</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td>{getLocalized(c.title, 'tr')}</td>
              <td>{c.placement}</td>
              <td>{c.isActive ? 'Aktif' : 'Pasif'}</td>
              <td className="actions">
                <Link to={`/admin/campaigns/edit/${c.id}`}>Düzenle</Link>
                <button onClick={() => handleDelete(c.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
