import Icon from '../../ui/Icon';

export default function LivePreviewPanel({ preview }) {
  return (
    <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-2 p-6 flex flex-col h-[500px] sticky top-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <Icon name="visibility" size={20} className="text-secondary" />
          <h3 className="font-h2 text-h2 text-[18px] text-primary">Live Preview</h3>
        </div>
        <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-outline-variant">
          Drafting
        </span>
      </div>

      <div className="flex-1 border border-outline-variant/50 rounded-lg bg-surface p-5 overflow-y-auto relative">
        <div className="absolute -right-12 -top-12 w-40 h-40 border-[2px] border-outline-variant/20 rounded-full pointer-events-none" />
        <div className="mb-4 inline-block bg-surface-container-low border border-outline-variant px-3 py-1 rounded-full font-citation text-citation text-[11px] text-primary">
          {preview.module}
        </div>
        <h4 className="font-h1 text-[22px] leading-tight text-primary mb-4 font-bold">{preview.title}</h4>
        <p className="font-body-md text-[14px] leading-relaxed text-on-background mb-4">{preview.body}</p>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-sm my-4">
          <h5 className="font-label-caps text-label-caps text-primary mb-2 flex items-center gap-1">
            <Icon name="gavel" size={16} /> Key Precedent
          </h5>
          <p className="font-body-md text-[13px] text-on-surface-variant">{preview.precedent}</p>
        </div>
        <div className="flex gap-chat-gap mt-6 animate-pulse">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="smart_toy" size={14} className="text-on-primary" />
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl rounded-tl-none p-3 shadow-sm">
            <p className="font-body-md text-[13px] text-on-background">{preview.suggestion}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 border border-outline text-on-surface-variant py-2 rounded-lg font-label-caps text-label-caps font-semibold hover:bg-surface-container transition-colors">
          Discard
        </button>
        <button className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-caps text-label-caps font-semibold hover:bg-primary-container transition-colors shadow-sm">
          Save Draft
        </button>
      </div>
    </div>
  );
}
