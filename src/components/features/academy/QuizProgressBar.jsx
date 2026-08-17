import { cx } from '../../../lib/utils';

export default function QuizProgressBar({ total, current }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest min-w-max">
        Question {current + 1} of {total}
      </span>
      <div className="flex-1 flex gap-1 h-2">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < current;
          const active = i === current;
          return (
            <div
              key={i}
              className={cx(
                'flex-1 rounded-full relative overflow-hidden',
                filled && 'bg-secondary-container',
                active && 'bg-secondary-container',
                !filled && !active && 'bg-surface-container-highest',
              )}
            >
              {active && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}