import { cx } from '../../lib/utils';

export default function Tabs({ tabs, activeId, onChange = () => {}, className = '' }) {
  return (
    <div className={cx('flex items-center gap-1 border-b border-outline-variant', className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              'px-4 py-2.5 text-label-caps font-label-caps tracking-wider uppercase border-b-2 transition-colors -mb-px',
              active
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
