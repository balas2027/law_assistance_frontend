import Icon from '../../ui/Icon';

export default function SuggestedPrompts({ prompts, onSelect }) {
  return (
    <div className="w-full mb-12">
      <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4 pl-1">
        SUGGESTED STARTING POINTS
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect?.(prompt.text)}
            className="bg-white border border-gray-200/90 rounded-sm p-5 text-left hover:border-[#0b57d0]/60 hover:shadow-xs transition-all duration-200 group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="w-9 h-9 rounded-sm bg-[#eaf1fc] text-[#0b57d0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Icon name={prompt.icon} size={20} />
            </div>
            <p className="text-[14px] text-gray-900 font-semibold leading-snug group-hover:text-[#0b57d0] transition-colors">
              {prompt.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

