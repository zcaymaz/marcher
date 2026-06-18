interface Props {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}

export default function FormLabel({ children, required, optional, htmlFor }: Props) {
  return (
    <label className="form-label" htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="required-mark" title="Zorunlu alan">
          {' '}*
        </span>
      )}
      {optional && <span className="optional-badge">opsiyonel</span>}
    </label>
  );
}
