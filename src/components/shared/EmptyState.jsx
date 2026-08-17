import Icon from '../ui/Icon';

export default function EmptyState({ icon = 'inbox', title, description, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon name={icon} size={40} className="text-outline mb-4" />
      <p className="font-body-md text-on-surface-variant font-medium">{title}</p>
      {description && <p className="font-body-md text-sm text-outline mt-2">{description}</p>}
    </div>
  );
}
