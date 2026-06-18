interface Props {
  label?: string;
}

export default function AdminLoading({ label = 'Yükleniyor...' }: Props) {
  return (
    <div className="admin-loading">
      <div className="admin-loading__spinner" />
      <p>{label}</p>
    </div>
  );
}
