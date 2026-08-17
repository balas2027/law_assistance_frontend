import Icon from '../../ui/Icon';
import { LESSON_STATUS } from '../../../types/academy';
import { cx } from '../../../lib/utils';

function LessonDot({ status }) {
  if (status === LESSON_STATUS.COMPLETED) {
    return (
      <div className="w-6 h-6 rounded-full bg-tertiary-container flex-shrink-0 flex items-center justify-center border-2 border-surface-container-lowest shadow-sm mt-0.5">
        <Icon name="check" size={14} className="text-white" />
      </div>
    );
  }
  if (status === LESSON_STATUS.CURRENT) {
    return (
      <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center border-2 border-surface-container-lowest shadow-sm mt-0.5">
        <span className="w-2 h-2 rounded-full bg-secondary-container" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex-shrink-0 mt-0.5" />
  );
}

export default function ModuleMilestoneList({ lessons }) {
  return (
    <div className="space-y-1 relative before:absolute before:inset-y-4 before:left-[19px] before:w-px before:bg-outline-variant z-0">
      {lessons.map((lesson) => {
        const isCurrent = lesson.status === LESSON_STATUS.CURRENT;
        return (
          <div
            key={lesson.id}
            className={cx(
              'flex gap-4 relative z-10 rounded-lg transition-colors cursor-pointer group',
              isCurrent
                ? 'p-3 bg-primary-fixed border border-primary-fixed-dim shadow-sm mt-2 mb-2'
                : 'p-2 hover:bg-surface-container-low',
            )}
          >
            <LessonDot status={lesson.status} />
            <div>
              <h4
                className={cx(
                  'text-sm transition-colors',
                  isCurrent
                    ? 'font-bold text-primary'
                    : lesson.status === LESSON_STATUS.COMPLETED
                      ? 'font-medium text-on-surface-variant group-hover:text-on-surface'
                      : 'font-medium text-on-surface group-hover:text-primary',
                )}
              >
                {lesson.title}
              </h4>
              <p className={cx('text-xs mt-0.5', isCurrent ? 'text-primary-fixed-variant' : 'text-outline')}>
                {lesson.meta}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
