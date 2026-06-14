import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { User } from '../../types';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', isAdmin: false });

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/users', form);
    setUsers([data, ...users]);
    setForm({ name: '', email: '', password: '', isAdmin: false });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div>
      <h1>Kullanıcı Yönetimi</h1>
      <form onSubmit={handleCreate} className="admin-form inline-form">
        <input placeholder="Ad" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="E-posta" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Şifre" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label><input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} /> Admin</label>
        <button type="submit" className="btn btn-primary">Ekle</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr><th>Ad</th><th>E-posta</th><th>Admin</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? 'Evet' : 'Hayır'}</td>
              <td className="actions">
                {!u.isAdmin && <button onClick={() => handleDelete(u.id)}>Sil</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
