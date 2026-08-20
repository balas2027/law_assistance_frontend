import { useState } from 'react';
import { MESSAGE_ROLES } from '../../../types/chat';
import Icon from '../../ui/Icon';

function ActionRow({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-6 pt-4 border-t border-surface-variant text-on-surface-variant">
      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-1 text-xs cursor-pointer"
        title="Copy text"
      >
        <Icon name={copied ? 'check' : 'content_copy'} size={18} />
        {copied && <span>Copied</span>}
      </button>
      <button
        type="button"
        className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
        title="Regenerate response"
      >
        <Icon name="refresh" size={18} />
      </button>
      <div className="w-px h-4 bg-outline-variant mx-2" />
      <button
        type="button"
        className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
        title="Helpful"
      >
        <Icon name="thumb_up" size={18} />
      </button>
      <button
        type="button"
        className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
        title="Not helpful"
      >
        <Icon name="thumb_down" size={18} />
      </button>
    </div>
  );
}

function DocumentBlock({ document }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
        <Icon name="picture_as_pdf" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-body-md font-semibold text-primary-container truncate">{document.name}</h4>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{document.description}</p>
        <div className="flex gap-2 mt-3">
          <button className="bg-surface-container-low text-primary-container border border-outline-variant rounded-full px-3 py-1 text-xs font-medium hover:bg-surface-container transition-colors">
            Find risky clauses
          </button>
          <button className="bg-surface-container-low text-primary-container border border-outline-variant rounded-full px-3 py-1 text-xs font-medium hover:bg-surface-container transition-colors">
            Summarize obligations
          </button>
        </div>
      </div>
    </div>
  );
}

function SourcesSection({ sources }) {
  const [expanded, setExpanded] = useState(false);
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="auto_awesome" size={16} className="text-[#0b57d0]" />
          Grounding Legal Sources ({sources.length})
        </h4>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-[#0b57d0] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {expanded ? 'Collapse' : 'View Excerpts'}
          <Icon name={expanded ? 'expand_less' : 'expand_more'} size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {sources.slice(0, expanded ? sources.length : 2).map((source, index) => {
          const title = source.metadata?.title || source.title || `Source ${index + 1}`;
          const reference =
            source.reference ||
            source.metadata?.reference ||
            source.metadata?.reference_number ||
            source.metadata?.section ||
            '';
          const sourceType = (source.metadata?.source_type || source.source_type || 'statute').toUpperCase();
          const snippet = source.content || '';

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-3 text-xs leading-relaxed transition-all hover:bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-gray-900 flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#0b57d0]/10 text-[#0b57d0] text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="truncate">{title}</span>
                  {reference && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase shrink-0">
                      {reference}
                    </span>
                  )}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0b57d0]/5 text-[#0b57d0] border border-[#0b57d0]/20 uppercase shrink-0">
                  {sourceType}
                </span>
              </div>
              {expanded && snippet && (
                <p className="text-gray-600 text-[11px] bg-gray-50 p-2 rounded border border-gray-100 mt-2 line-clamp-4">
                  "{snippet.trim()}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function AssistantContent({ message }) {
  const { blocks = [], content, sources = [], isError } = message;

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start gap-3">
        <Icon name="warning" size={20} className="text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">{content}</div>
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none text-primary-container">
      {content && (
        <div className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">
          {formatText(content)}
        </div>
      )}

      {blocks.map((block) => (
        <div key={block.title}>
          <h4 className="font-body-md font-semibold mt-6 mb-2 text-primary">{block.title}</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2 text-on-surface-variant">
            {block.items.map((item) => {
              const isHighlighted =
                item.startsWith('**') ||
                item.startsWith('Legal Standing:') ||
                item.startsWith('Risk Flag:') ||
                item.startsWith('Standard Practice:');
              const contentText = item.replace(/^\*\*/, '').replace(/\*\*$/, '');
              return (
                <li key={contentText}>
                  {isHighlighted ? (
                    <strong className="text-primary-container">{contentText}</strong>
                  ) : (
                    contentText
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <SourcesSection sources={sources} />
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === MESSAGE_ROLES.USER;

  if (isUser) {
    return (
      <div className="self-end max-w-[85%] flex flex-col gap-4">
        {message.document && <DocumentBlock document={message.document} />}
        {message.content && (
          <div className="self-end max-w-[85%] bg-primary-container text-on-primary rounded-2xl rounded-tr-sm px-5 py-4 shadow-level-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 border border-on-primary/10 rounded-full opacity-50" />
            <p className="font-body-md leading-relaxed text-[15px]">{message.content}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="self-start max-w-[85%] bg-surface-container-lowest text-primary-container rounded-2xl rounded-tl-sm px-6 py-6 shadow-level-1 border border-outline-variant relative">
      <div className="absolute -left-3 -top-3 w-8 h-8 bg-surface-container-lowest border border-outline-variant rounded-full flex items-center justify-center shadow-sm">
        <Icon name="balance" size={16} fill className="text-secondary-container" />
      </div>
      <AssistantContent message={message} />
      <ActionRow content={message.content} />
    </div>
  );
}

