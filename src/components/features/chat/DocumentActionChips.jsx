export default function DocumentActionChips({ actions }) {
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {actions.map((action) => (
        <button
          key={action}
          className="bg-surface-container-low text-primary-container border border-outline-variant rounded-full px-3 py-1 text-xs font-medium hover:bg-surface-container transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
