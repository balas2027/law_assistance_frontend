import Icon from '../../ui/Icon';

export default function DocumentCard({ document, onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm hover:border-primary-container transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded bg-error/10 text-error flex items-center justify-center">
          <Icon name="description" size={18} />
        </div>
        <span className="font-body-md text-sm font-medium text-primary-container truncate group-hover:text-primary transition-colors">
          {document.name}
        </span>
      </div>
      <div className="text-[11px] text-outline flex justify-between">
        <span>{document.uploaded ?? 'Uploaded today'}</span>
        <span>{document.size}</span>
      </div>
    </div>
  );
}
