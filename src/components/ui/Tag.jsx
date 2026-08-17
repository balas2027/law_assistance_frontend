import { cx } from '../../lib/utils';

export default function Tag({ children, className = '', ...rest }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant text-primary text-citation font-citation text-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
