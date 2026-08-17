import { useState } from 'react';
import Icon from '../../ui/Icon';

export default function ChatInput({ onSend, attachments = [], onRemoveAttachment = null, placeholder = 'Ask a legal question...' }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <div className="w-full">
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
                <button className="ml-auto hover:text-error transition-colors" onClick={() => onRemoveAttachment(att.name)}>
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container p-2 flex items-end gap-2 transition-colors">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container flex-shrink-0" aria-label="Attach document">
          <Icon name="attach_file" size={20} />
        </button>
        <textarea
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 max-h-32 text-[15px] text-primary-container placeholder:text-outline-variant scrollbar-hide outline-none"
          placeholder={placeholder}
          rows={1}
          value={value}
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
          className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 hover:bg-primary transition-colors shadow-sm"
          onClick={handleSend}
          aria-label="Send message"
        >
          <Icon name="send" size={20} fill />
        </button>
      </div>
    </div>
  );
}
