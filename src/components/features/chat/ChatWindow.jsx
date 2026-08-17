import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, emptyState = null }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 flex flex-col gap-8 pb-40">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
