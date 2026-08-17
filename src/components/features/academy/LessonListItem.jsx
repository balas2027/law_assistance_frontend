import { Link } from 'react-router-dom';
import Icon from '../../ui/Icon';
import { LESSON_STATUS } from '../../../types/academy';
import { cx } from '../../../lib/utils';

function Node({ status }) {
  if (status === LESSON_STATUS.COMPLETED) {
    return (
      <div className="path-node w-14 h-14 rounded-full bg-tertiary-container text-on-tertiary shadow-level-1 flex items-center justify-center border-4 border-background shrink-0 mt-2">
        <Icon name="check" size={22} fill />
      </div>
    );
  }
  if (status === LESSON_STATUS.CURRENT) {
    return (
      <div className="path-node w-16 h-16 -ml-1 rounded-full bg-secondary-container text-on-secondary-container shadow-level-2 flex items-center justify-center border-4 border-background shrink-0 mt-1 relative">
        <div className="absolute inset-0 rounded-full bg-secondary-container opacity-30 animate-ping" />
        <Icon name="play_arrow" size={24} fill className="relative z-10" />
      </div>
    );
  }
  return (
    <div className="path-node w-14 h-14 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-4 border-background shrink-0 mt-2">
      <Icon name="lock" size={22} />
    </div>
  );
}

export default function LessonListItem({ lesson }) {
  const { status } = lesson;
  const isCompleted = status === LESSON_STATUS.COMPLETED;
  const isCurrent = status === LESSON_STATUS.CURRENT;
  const isLocked = status === LESSON_STATUS.LOCKED;

  const content = (
    <div className={cx('flex items-start gap-6 mb-12 group cursor-pointer relative', isLocked && 'opacity-60')}>
      <div className={cx('path-line', isCompleted && 'completed')} />
      <Node status={status} />
      <div
        className={cx(
          'flex-1 border rounded-card transition-shadow mt-1',
          isCompleted && 'bg-surface-container-lowest border-outline-variant p-5 shadow-sm hover:shadow-level-1',
          isCurrent &&
            'bg-surface-container-lowest border-2 border-secondary-container p-6 shadow-level-2 transform transition-transform hover:-translate-y-1',
          isLocked && 'bg-surface-container-low border-outline-variant p-5',
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <div
            className={cx(
              'font-citation text-citation px-2 py-1 rounded-sm inline-block',
              isCurrent ? 'text-secondary-container bg-secondary-fixed font-bold' : 'bg-surface-container-low text-on-surface-variant',
              isLocked && 'bg-surface-variant',
            )}
          >
            {isCurrent ? 'Current Lesson' : lesson.module}
          </div>
          {isCompleted && <Icon name="task_alt" size={22} className="text-tertiary-container" />}
          {isCurrent && (
            <div className="flex items-center gap-1 text-on-surface-variant">
              <Icon name="schedule" size={18} />
              <span className="font-label-caps text-label-caps">{lesson.duration}</span>
            </div>
          )}
        </div>
        <h3
          className={cx(
            'font-h2 text-[20px] leading-[28px] mb-1',
            isCurrent && 'text-[24px] leading-[32px] mb-2',
            isLocked ? 'text-on-surface-variant' : 'text-primary-container',
          )}
        >
          {lesson.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{lesson.description}</p>
        {isCurrent && (
          <button className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-opacity-90 transition-opacity mt-4">
            Resume Learning
          </button>
        )}
      </div>
    </div>
  );

  if (isLocked) return content;

  return (
    <Link to={`/academy/lesson/${lesson.id}`} className="block">
      {content}
    </Link>
  );
}
