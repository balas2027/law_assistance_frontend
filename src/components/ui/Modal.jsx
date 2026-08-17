import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/utils';

export default function Modal({ open = false, onClose = () => {}, title = null, children, className = '' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'relative bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-2 w-full max-w-lg p-6',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="font-h2 text-h2 text-[20px] text-primary font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
