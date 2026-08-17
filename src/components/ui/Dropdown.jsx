import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/utils';

export default function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cx(
            'absolute z-40 mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-2 min-w-[180px] py-1.5',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon = null, children, onClick = () => {}, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors',
        className,
      )}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}
