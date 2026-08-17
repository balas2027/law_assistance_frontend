import Icon from '../../ui/Icon';

export default function SuggestedPrompts({ prompts, onSelect }) {
  return (
    <div className="w-full mb-12">
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 pl-1">SUGGESTED STARTING POINTS</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect?.(prompt.text)}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-left hover:border-secondary-container hover:-translate-y-0.5 hover:shadow-level-1 transition-all duration-200 group"
          >
            <Icon name={prompt.icon} size={24} className="text-on-surface-variant mb-3 block group-hover:text-secondary-container transition-colors" />
            <p className="font-body-md text-on-surface font-medium leading-snug">{prompt.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
