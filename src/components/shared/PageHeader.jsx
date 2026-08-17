export default function PageHeader({ title, description = null, actions = null, className = '' }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-2">{title}</h1>
        {description && <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0 self-start md:self-auto">{actions}</div>}
    </div>
  );
}
