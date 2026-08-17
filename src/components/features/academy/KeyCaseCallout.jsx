import Icon from '../../ui/Icon';

export default function KeyCaseCallout({ title, description }) {
  return (
    <div className="bg-primary-fixed/30 border border-primary-fixed rounded-lg p-4 mb-6">
      <div className="flex gap-2 items-center mb-2">
        <Icon name="lightbulb" size={20} className="text-primary-container" />
        <span className="font-label-caps text-label-caps font-bold text-primary-container">{title}</span>
      </div>
      <p className="font-body-md text-body-md text-primary-container text-sm">{description}</p>
    </div>
  );
}
