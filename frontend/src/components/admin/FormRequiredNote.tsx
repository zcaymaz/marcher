export default function FormRequiredNote() {
  return (
    <div className="form-required-note" role="note">
      <span className="form-required-note__icon" aria-hidden="true">
        <i className="bi bi-asterisk" />
      </span>
      <div>
        <strong>Zorunlu alanlar</strong>
        <p>
          <span className="required-mark">*</span> ile işaretli alanları doldurun. Çok dilli alanlarda{' '}
          <strong>TR, EN ve FR</strong> sekmelerinin tamamı zorunludur.
        </p>
      </div>
    </div>
  );
}
