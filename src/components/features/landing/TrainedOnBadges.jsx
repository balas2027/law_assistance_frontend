export default function TrainedOnBadges({ items }) {
  return (
    <div className="flex items-center gap-6 pt-6 border-t border-surface-variant">
      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Trained On:</p>
      <div className="flex gap-4 flex-wrap">
        {items.map((item) => (
          <span
            key={item}
            className="font-citation text-citation text-primary bg-surface-container-low px-2 py-1 rounded-sm border border-surface-variant"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
