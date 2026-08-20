import Icon from '../ui/Icon';

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[#0b57d0]/5 flex items-center justify-center mb-4">
        <Icon name="find_in_page" size={24} className="text-[#0b57d0]/60" />
      </div>
      <p className="font-body-md text-sm font-medium text-gray-700">No AI context yet</p>
      <p className="font-body-md text-xs text-gray-400 mt-1.5 leading-relaxed">
        Retrieved legal sources returned by the AI will appear here as your conversation progresses.
      </p>
    </div>
  );
}

function AiSources({ sources }) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f9f9f9]">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0 shadow-sm">
        <h4 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
          Sources
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {sources.length}
          </span>
        </h4>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sources.map((source, index) => {
          const title = source.metadata?.title || source.title || `Source ${index + 1}`;
          const reference =
            source.reference ||
            source.metadata?.reference ||
            source.metadata?.reference_number ||
            source.metadata?.section ||
            '';
          const sourceType = (source.metadata?.source_type || source.source_type || 'statute');
          const snippet = source.content || '';
          const domain = source.metadata?.domain || (sourceType === 'bns' ? 'bns.gov.in' : 'indiankanoon.org');

          return (
            <div
              key={index}
              className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm overflow-hidden transition-all duration-200 cursor-pointer"
            >
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      alt={domain}
                      className="w-3 h-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full text-[8px] items-center justify-center font-bold text-gray-500">
                      {index + 1}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium truncate">
                    {domain}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-[#1a0dab] group-hover:underline leading-snug line-clamp-2">
                  {title} {reference ? `- ${reference}` : ''}
                </h3>
                {snippet && (
                  <p className="mt-1.5 text-[12px] text-[#4d5156] leading-relaxed line-clamp-3">
                    {snippet.trim()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RightPanel({ mode = 'empty', sources = [], title = null }) {
  const hasSources = Array.isArray(sources) && sources.length > 0;
  return (
    <aside className="w-80 border-l border-gray-200 bg-[#fafbfc] hidden lg:flex flex-col relative z-20">
      <div className="h-16 border-b border-gray-200/90 flex items-center px-6">
        <h2 className="font-body-md font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="auto_awesome" size={18} className="text-[#0b57d0]" />
          {title ?? 'AI Context'}
        </h2>
      </div>
      {mode === 'empty' || !hasSources ? <EmptyState /> : <AiSources sources={sources} />}
    </aside>
  );
}
