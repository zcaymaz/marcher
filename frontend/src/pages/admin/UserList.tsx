import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { User } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminLoading from '../../components/admin/AdminLoading';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/users').then(({ data }) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/users', form);
      setUsers([data, ...users]);
      setForm({ name: '', email: '', password: '', isAdmin: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Kullanıcı Yönetimi"
        subtitle={`${users.length} kullanıcı`}
      />

      <AdminCard title="Yeni Kullanıcı Ekle" subtitle="Panel erişimi için kullanıcı oluşturun">
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ad Soyad</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ad Soyad" />
            </div>
            <div className="form-group">
              <label className="form-label">E-posta</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@marcher.com" />
            </div>
          </div>
          <div className="form-row form-row--align-fields">
            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <span className="form-label form-label-spacer" aria-hidden="true">Yetki</span>
              <label className="admin-toggle admin-toggle--field">
                <input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} />
                <span className="admin-toggle__text">Admin yetkisi ver</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Kullanıcı Listesi" noPadding>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>E-posta</th>
                <th>Yetki</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="table-cell-title">{u.name}</td>
                  <td className="table-cell-muted">{u.email}</td>
                  <td>
                    <AdminBadge variant={u.isAdmin ? 'success' : 'default'}>
                      {u.isAdmin ? 'Admin' : 'Kullanıcı'}
                    </AdminBadge>
                  </td>
                  <td>
                    {!u.isAdmin && <AdminTableActions onDelete={() => handleDelete(u.id)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
