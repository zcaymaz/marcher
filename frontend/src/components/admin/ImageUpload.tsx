interface Props {
  value?: string;
  uploading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
}

export default function ImageUpload({
  value,
  uploading,
  onChange,
  label = 'Görsel',
  required,
  optional,
  error,
}: Props) {
  return (
    <div className={`admin-image-upload${error ? ' has-error' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="required-mark"> *</span>}
        {optional && <span className="optional-badge">opsiyonel</span>}
      </label>
      {required && (
        <span className="field-hint" style={{ marginTop: 0, marginBottom: 8 }}>
          Bu yerleşim için görsel zorunludur
        </span>
      )}
      <label className="admin-image-upload__dropzone">
        <input type="file" accept="image/*" onChange={onChange} className="admin-image-upload__input" />
        <div className="admin-image-upload__placeholder">
          <i className="bi bi-cloud-arrow-up" />
          <span>{uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}</span>
          <small>PNG, JPG — max 10MB</small>
        </div>
      </label>
      {value && (
        <div className="admin-image-upload__preview">
          <img src={value} alt="" />
        </div>
      )}
    </div>
  );
}
