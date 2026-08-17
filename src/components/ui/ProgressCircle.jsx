import { cx } from '../../lib/utils';

export default function ProgressCircle({
  value = 0,
  size = 64,
  strokeWidth = 4,
  label = null,
  trackClass = 'text-surface-container-highest',
  progressClass = 'text-secondary-container',
  className = '',
  viewBox = 36,
}) {
  const radius = (viewBox - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div
      className={cx('relative flex items-center justify-center shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBox} ${viewBox}`}>
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClass}
        />
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash}, ${circumference}`}
          strokeLinecap="round"
          className={progressClass}
        />
      </svg>
      {label !== null && (
        <div className="absolute inset-0 flex items-center justify-center">{label}</div>
      )}
    </div>
  );
}
