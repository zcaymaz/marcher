import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FranchiseInquiry } from '../../types';

export default function FranchiseList() {
  const [inquiries, setInquiries] = useState<FranchiseInquiry[]>([]);

  useEffect(() => {
    api.get('/franchise').then(({ data }) => setInquiries(data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/franchise/${id}/status`, { status });
    setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status: status as FranchiseInquiry['status'] } : i)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/franchise/${id}`);
    setInquiries(inquiries.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h1>Franchise Başvuruları</h1>
      <table className="admin-table">
        <thead>
          <tr><th>Ad</th><th>E-posta</th><th>Şehir</th><th>Durum</th><th>Tarih</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {inquiries.map((inq) => (
            <tr key={inq.id}>
              <td>{inq.name}</td>
              <td>{inq.email}</td>
              <td>{inq.city || '-'}</td>
              <td>
                <select value={inq.status} onChange={(e) => updateStatus(inq.id, e.target.value)}>
                  <option value="NEW">Yeni</option>
                  <option value="CONTACTED">İletişime Geçildi</option>
                  <option value="CLOSED">Kapatıldı</option>
                </select>
              </td>
              <td>{new Date(inq.createdAt).toLocaleDateString('tr')}</td>
              <td className="actions">
                <button onClick={() => handleDelete(inq.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
