import { cx } from '../../lib/utils';

export default function ProgressBar({
  value = 0,
  className = '',
  barClass = 'bg-secondary-container',
  height = 'h-2',
}) {
  return (
    <div className={cx('w-full rounded-full overflow-hidden bg-surface-container-highest', height, className)}>
      <div className={cx('h-full rounded-full', barClass)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
