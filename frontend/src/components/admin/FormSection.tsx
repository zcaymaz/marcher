interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, children }: Props) {
  return (
    <section className="admin-form-section">
      <div className="admin-form-section__head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="admin-form-section__body">{children}</div>
    </section>
  );
}
