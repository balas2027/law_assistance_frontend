import { cx } from '../../../lib/utils';
import { relativeTime } from '../../../lib/utils';

export default function ChatHistoryList({ chats, activeId = null, onSelect = () => {} }) {
  return (
    <div className="flex flex-col gap-1">
      {chats.map((chat) => {
        const active = chat.id === activeId;
        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cx(
              'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 group',
              active
                ? 'bg-surface-container-high text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary',
            )}
          >
            <span className="font-body-md text-[15px] truncate w-full">{chat.title}</span>
            <span className="font-label-caps text-[11px] text-outline">{relativeTime(chat.updatedAt)}</span>
          </button>
        );
      })}
    </div>
  );
}
