import { MESSAGE_ROLES } from '../../../types/chat';
import Icon from '../../ui/Icon';

function ActionRow() {
  return (
    <div className="flex items-center gap-1 mt-6 pt-4 border-t border-surface-variant text-on-surface-variant">
      <button className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors" title="Copy text">
        <Icon name="content_copy" size={20} />
      </button>
      <button className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors" title="Regenerate response">
        <Icon name="refresh" size={20} />
      </button>
      <div className="w-px h-4 bg-outline-variant mx-2" />
      <button className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors" title="Helpful">
        <Icon name="thumb_up" size={20} />
      </button>
      <button className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors" title="Not helpful">
        <Icon name="thumb_down" size={20} />
      </button>
      <div className="w-px h-4 bg-outline-variant mx-2" />
      <button className="p-1.5 rounded hover:bg-surface-container hover:text-primary transition-colors" title="Bookmark">
        <Icon name="bookmark_add" size={20} />
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

function AssistantContent({ message }) {
  const { blocks = [], content } = message;
  return (
    <div className="prose prose-sm max-w-none text-primary-container">
      {message.sources?.length > 0 && (
        <h3 className="font-h2 text-[18px] mb-4 text-primary font-semibold flex items-center gap-2">
          <Icon name="analytics" size={20} className="text-secondary-container" />
          Analysis of your agreement
        </h3>
      )}
      {content && <p className="mb-4">{content}</p>}
      {blocks.map((block) => (
        <div key={block.title}>
          <h4 className="font-body-md font-semibold mt-6 mb-2 text-primary">{block.title}</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2 text-on-surface-variant">
            {block.items.map((item) => {
              const isHighlighted = item.startsWith('**') || item.startsWith('Legal Standing:') || item.startsWith('Risk Flag:') || item.startsWith('Standard Practice:');
              const contentText = item.replace(/^\*\*/, '').replace(/\*\*$/, '');
              return (
                <li key={contentText}>
                  {isHighlighted ? <strong className="text-primary-container">{contentText}</strong> : contentText}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
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
      <ActionRow />
    </div>
  );
}
