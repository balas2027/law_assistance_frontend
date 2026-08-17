import { cx } from '../../lib/utils';

export default function Card({ className = '', children, hover = false, ...rest }) {
  return (
    <div
      className={cx(
        'bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1',
        hover && 'transition-shadow hover:shadow-level-2',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
