import { useState } from 'react';
import Icon from '../../ui/Icon';

export default function CitationTagInput({ citations, onAdd, onRemove }) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div>
      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
        Reference Acts &amp; Citations
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {citations.map((citation) => (
          <span
            key={citation}
            className="bg-[#FAFAF7] border border-ink-border text-primary-container font-citation text-citation px-3 py-1 rounded-full flex items-center gap-1"
          >
            {citation}
            <button className="hover:text-error" onClick={() => onRemove(citation)} aria-label={`Remove ${citation}`}>
              <Icon name="close" size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          className="w-full bg-surface-container-lowest border border-ink-border rounded-lg px-3 py-2 pl-9 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-colors"
          placeholder="Search acts or cases..."
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Icon name="search" size={18} className="absolute left-2.5 top-2.5 text-outline-variant" />
      </div>
    </div>
  );
}
