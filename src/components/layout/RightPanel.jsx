import Icon from '../ui/Icon';

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
      <Icon name="find_in_page" size={40} className="text-outline mb-4" />
      <p className="font-body-md text-on-surface-variant font-medium">No AI context yet</p>
      <p className="font-body-md text-sm text-outline mt-2">
        Retrieved legal sources returned by the AI will appear here as your conversation progresses.
      </p>
    </div>
  );
}

function AiSources({ sources }) {
  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto">
      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
          Retrieved Legal Sources ({sources.length})
        </h4>
        <ul className="space-y-3">
          {sources.map((source, index) => {
            const title = source.metadata?.title || source.title || `Source ${index + 1}`;
            const sourceType =
              (source.metadata?.source_type || source.source_type || 'statute').toUpperCase();
            const refNum =
              source.metadata?.reference_number || source.metadata?.section || '';
            const snippet = source.content || '';

            return (
              <li
                key={index}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-body-md text-sm font-semibold text-primary-container flex items-center gap-1.5">
                    <Icon name="gavel" size={14} className="text-primary" />
                    {title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/5 text-primary border border-outline-variant uppercase shrink-0">
                    {sourceType}
                  </span>
                </div>
                {refNum && (
                  <p className="text-[11px] text-on-surface-variant mb-1">
                    {refNum}
                  </p>
                )}
                {snippet && (
                  <p className="text-[11px] leading-relaxed text-on-surface-variant font-mono bg-surface-container/60 p-2 rounded border border-outline-variant/60 line-clamp-4">
                    "{snippet.trim()}"
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function RightPanel({ mode = 'empty', sources = [], title = null }) {
  const hasSources = Array.isArray(sources) && sources.length > 0;
  return (
    <aside className="w-80 border-l border-outline-variant bg-surface-container-lowest hidden xl:flex flex-col relative z-20">
      <div className="h-16 border-b border-outline-variant/50 flex items-center px-6">
        <h2 className="font-body-md font-semibold text-primary-container">{title ?? 'AI Context'}</h2>
      </div>
      {mode === 'empty' || !hasSources ? <EmptyState /> : <AiSources sources={sources} />}
    </aside>
  );
}