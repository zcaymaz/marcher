import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../utils/api';
import { Reference, getLocalized } from '../../types';

export default function ReferenceList() {
  const [refs, setRefs] = useState<Reference[]>([]);

  useEffect(() => {
    api.get('/references').then(({ data }) => setRefs(data));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/references/${slug}`);
    setRefs(refs.filter((r) => r.slug !== slug));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Referans Yönetimi</h1>
        <Link to="/admin/references/new" className="btn btn-primary">Yeni Referans</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Görsel</th><th>Ad</th><th>Tip</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {refs.map((ref) => (
            <tr key={ref.id}>
              <td>{(ref.logo || ref.image) && <img src={getImageUrl(ref.logo || ref.image)} alt="" className="table-thumb" />}</td>
              <td>{getLocalized(ref.name, 'tr')}</td>
              <td>{ref.type}</td>
              <td className="actions">
                <Link to={`/admin/references/edit/${ref.slug}`}>Düzenle</Link>
                <button onClick={() => handleDelete(ref.slug)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
