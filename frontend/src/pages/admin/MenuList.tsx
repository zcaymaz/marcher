import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../utils/api';
import { formatPrice } from '../../utils/formatPrice';
import { MenuItem, getLocalized } from '../../types';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTableActions from '../../components/admin/AdminTableActions';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoading from '../../components/admin/AdminLoading';

type ImportResult = {
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; message: string }[];
};

const categoryLabels: Record<string, string> = {
  coffee: 'Kahve',
  croissant: 'Kruvasan',
  pastry: 'Hamur İşi',
  food: 'Yemek',
  cold: 'Soğuk İçecek',
};

export default function MenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = () =>
    api.get('/menu').then(({ data }) => {
      setItems(data);
      setLoading(false);
    });

  useEffect(() => {
    loadItems();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setImportMessage(null);
    try {
      const { data } = await api.get('/menu/export/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `marcher-menu-${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setImportMessage('Excel dışa aktarımı başarısız oldu.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setImporting(true);
    setImportMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<ImportResult>('/menu/import/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parts = [
        `${data.created} yeni ürün eklendi`,
        `${data.updated} ürün güncellendi`,
      ];
      if (data.failed > 0) {
        parts.push(`${data.failed} satır hatalı`);
      }
      setImportMessage(parts.join(', ') + '.');

      if (data.errors.length > 0) {
        const preview = data.errors
          .slice(0, 3)
          .map((err) => `Satır ${err.row}: ${err.message}`)
          .join(' | ');
        setImportMessage((prev) => `${prev ?? ''} ${preview}`);
      }

      await loadItems();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
          ?.message;
      setImportMessage(
        Array.isArray(message) ? message.join(', ') : message || 'Excel içe aktarımı başarısız oldu.',
      );
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await api.delete(`/menu/${slug}`);
    setItems(items.filter((i) => i.slug !== slug));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Menü Yönetimi"
        subtitle={`${items.length} ürün listeleniyor`}
        action={
          <div className="admin-header-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExport}
              disabled={exporting || importing}
            >
              <i className="bi bi-download" />
              {exporting ? 'İndiriliyor...' : 'Excel İndir'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleImportClick}
              disabled={exporting || importing}
            >
              <i className="bi bi-upload" />
              {importing ? 'Yükleniyor...' : 'Excel Yükle'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={handleImport}
            />
            <Link to="/admin/menu/new" className="btn btn-primary">
              <i className="bi bi-plus-lg" /> Yeni Ekle
            </Link>
          </div>
        }
      />

      {importMessage && (
        <div className={`admin-alert ${importMessage.includes('başarısız') || importMessage.includes('hatalı') ? 'admin-alert--error' : 'admin-alert--success'}`}>
          {importMessage}
        </div>
      )}

      <AdminCard noPadding>
        {items.length === 0 ? (
          <AdminEmptyState
            icon="bi-cup-hot"
            title="Henüz menü öğesi yok"
            description="İlk ürününüzü ekleyerek başlayın."
            action={
              <Link to="/admin/menu/new" className="btn btn-primary btn-sm">
                Yeni Ekle
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
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image ? (
                        <img src={getImageUrl(item.image)} alt="" className="table-thumb" />
                      ) : (
                        <div className="table-thumb" style={{ background: 'var(--grey-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-image" style={{ color: 'var(--grey-400)' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="table-cell-title">{getLocalized(item.name, 'tr')}</span>
                      {item.isFeatured && (
                        <span style={{ marginLeft: 8 }}>
                          <AdminBadge variant="warning">Öne Çıkan</AdminBadge>
                        </span>
                      )}
                    </td>
                    <td className="table-cell-muted">{categoryLabels[item.category] ?? item.category}</td>
                    <td><strong>{formatPrice(item.price)}</strong></td>
                    <td>
                      <AdminBadge variant={item.isAvailable ? 'success' : 'default'} dot>
                        {item.isAvailable ? 'Aktif' : 'Pasif'}
                      </AdminBadge>
                    </td>
                    <td>
                      <AdminTableActions
                        editTo={`/admin/menu/edit/${item.slug}`}
                        onDelete={() => handleDelete(item.slug)}
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
