import { cx } from '../../lib/utils';

export default function Icon({ name, size = 24, className = '', fill = false, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'material-symbols-outlined select-none',
        fill && 'material-symbols-fill',
        className,
      )}
      style={{ fontSize: size }}
      {...rest}
    >
      {name}
    </span>
  );
}
