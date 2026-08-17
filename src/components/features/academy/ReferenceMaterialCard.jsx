import Icon from '../../ui/Icon';

export default function ReferenceMaterialCard({ reference }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 relative">
      <div className="absolute -left-3 top-8 w-6 h-[1px] bg-outline-variant" />
      <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
        <Icon name="menu_book" size={16} />
        Reference Material
      </h4>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4">
        <p className="font-citation text-citation text-primary mb-2">{reference.title}</p>
        <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">{reference.text}</p>
        <button className="mt-3 text-secondary-container font-label-caps text-label-caps uppercase hover:underline flex items-center gap-1">
          Read Full Text
          <Icon name="open_in_new" size={14} />
        </button>
      </div>
    </div>
  );
}