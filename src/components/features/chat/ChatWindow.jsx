import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Icon from '../../ui/Icon';

export default function ChatWindow({ messages, loading = false, emptyState = null }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  if (messages.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 flex flex-col gap-8 pb-40">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {loading && (
        <div className="self-start max-w-[85%] bg-surface-container-lowest text-primary-container rounded-2xl rounded-tl-sm px-6 py-4 shadow-level-1 border border-outline-variant relative animate-pulse">
          <div className="absolute -left-3 -top-3 w-8 h-8 bg-surface-container-lowest border border-outline-variant rounded-full flex items-center justify-center shadow-sm">
            <Icon name="balance" size={16} fill className="text-secondary-container animate-spin" />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 py-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0b57d0] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#0b57d0] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#0b57d0] animate-bounce" />
            </div>
            <span className="font-medium text-[#0b57d0]">Searching statutes & retrieving legal context...</span>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

