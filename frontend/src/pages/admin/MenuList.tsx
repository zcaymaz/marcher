import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../utils/api';
import { MenuItem, getLocalized } from '../../types';

export default function MenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.get('/menu').then(({ data }) => setItems(data));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/menu/${slug}`);
    setItems(items.filter((i) => i.slug !== slug));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Menü Yönetimi</h1>
        <Link to="/admin/menu/new" className="btn btn-primary">Yeni Ekle</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Görsel</th>
            <th>Ad</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.image && <img src={getImageUrl(item.image)} alt="" className="table-thumb" />}</td>
              <td>{getLocalized(item.name, 'tr')}</td>
              <td>{item.category}</td>
              <td>{item.price.toFixed(2)} €</td>
              <td>{item.isAvailable ? 'Aktif' : 'Pasif'}</td>
              <td className="actions">
                <Link to={`/admin/menu/edit/${item.slug}`}>Düzenle</Link>
                <button onClick={() => handleDelete(item.slug)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
