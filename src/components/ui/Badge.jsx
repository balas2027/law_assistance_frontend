import { cx } from '../../lib/utils';

const TONES = {
  draft: 'bg-surface-container border border-outline-variant text-on-surface-variant',
  published:
    'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]',
  saffron:
    'border border-secondary-container text-secondary-container bg-secondary-container/5',
  navy: 'bg-surface-container-high text-on-surface',
  success: 'bg-tertiary-fixed/20 text-tertiary-container border border-tertiary-fixed-dim/40',
};

const DOT_COLORS = {
  draft: 'bg-secondary',
  published: 'bg-[#4caf50]',
  default: 'bg-secondary',
};

export default function Badge({ children, tone = 'draft', dot = false, className = '', ...rest }) {
  const dotColor = DOT_COLORS[tone] || DOT_COLORS.default;
  return (
    <span
      className={cx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className={cx('w-1.5 h-1.5 rounded-full mr-1.5', dotColor)} />}
      {children}
    </span>
  );
}
