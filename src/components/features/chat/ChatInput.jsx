import { useState } from 'react';
import Icon from '../../ui/Icon';
import { useChat } from '../../../hooks/useChat';

const SOURCE_OPTIONS = [
  { id: 'all', label: 'All Sources', icon: 'auto_awesome' },
  { id: 'constitution', label: 'Constitution', icon: 'menu_book' },
  { id: 'bns', label: 'BNS 2023', icon: 'gavel' },
  { id: 'ipc', label: 'IPC', icon: 'balance' },
];

export default function ChatInput({
  onSend,
  attachments = [],
  onRemoveAttachment = null,
  placeholder = 'Ask a legal question...',
  disabled = false,
}) {
  const [value, setValue] = useState('');
  const { loading, selectedSourceType, setSelectedSourceType } = useChat();

  const isSending = disabled || loading;

  const handleSend = () => {
    if (!value.trim() || isSending) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <div className="w-full">
      {/* Source Domain Selection Pills */}
      <div className="flex items-center gap-1.5 mb-2.5 px-1 overflow-x-auto scrollbar-hide py-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
          <Icon name="filter_list" size={14} /> Filter:
        </span>
        {SOURCE_OPTIONS.map((opt) => {
          const isSelected = selectedSourceType === opt.id || (selectedSourceType === null && opt.id === 'all');
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedSourceType(opt.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-[#0b57d0] text-white border-[#0b57d0] shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Icon name={opt.icon} size={14} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {attachments.length > 0 && (
        <div className="flex gap-2 mb-3 px-2 flex-wrap">
          {attachments.map((att) => (
            <div
              key={att.name}
              className="bg-surface-container-lowest border border-outline-variant rounded-full pl-2 pr-3 py-1 flex items-center gap-2 text-xs font-medium text-on-surface-variant shadow-sm max-w-[200px]"
            >
              <Icon name="picture_as_pdf" size={16} className="text-error" />
              <span className="truncate">{att.name}</span>
              {onRemoveAttachment && (
                <button
                  type="button"
                  className="ml-auto hover:text-error transition-colors"
                  onClick={() => onRemoveAttachment(att.name)}
                >
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container p-2 flex items-end gap-2 transition-colors">
        <button
          type="button"
          className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container flex-shrink-0"
          aria-label="Attach document"
        >
          <Icon name="attach_file" size={20} />
        </button>
        <textarea
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 max-h-32 text-[15px] text-primary-container placeholder:text-outline-variant scrollbar-hide outline-none disabled:opacity-50"
          placeholder={isSending ? 'NyayaAI is generating response...' : placeholder}
          rows={1}
          value={value}
          disabled={isSending}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ minHeight: 48 }}
        />
        <button
          type="button"
          disabled={isSending || !value.trim()}
          className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 hover:bg-primary transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleSend}
          aria-label="Send message"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Icon name="send" size={20} fill />
          )}
        </button>
      </div>
    </div>
  );
}

