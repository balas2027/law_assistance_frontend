import Icon from '../../ui/Icon';
import { SUBTOPIC_STATUS } from '../../../types/academy';
import { cx } from '../../../lib/utils';

function StatusIndicator({ status }) {
  if (status === SUBTOPIC_STATUS.COMPLETED) {
    return <Icon name="check_circle" size={20} className="text-tertiary-container mt-0.5" />;
  }
  if (status === SUBTOPIC_STATUS.IN_PROGRESS) {
    return <span className="chakra-loader w-5 h-5 shrink-0 mt-0.5 ml-[2px]" />;
  }
  return <Icon name="radio_button_unchecked" size={20} className="text-on-surface-variant mt-0.5 opacity-60" />;
}

export default function SubTopicList({ subTopics }) {
  return (
    <ul className="space-y-3">
      {subTopics.map((sub) => {
        const isInProgress = sub.status === SUBTOPIC_STATUS.IN_PROGRESS;
        return (
          <li key={sub.id} className={cx('flex gap-3 items-start relative', !isInProgress && sub.status === SUBTOPIC_STATUS.UPCOMING && 'opacity-60')}>
            {isInProgress && <div className="absolute -left-[5px] top-2 w-[2px] h-4 bg-secondary-container rounded-r" />}
            <StatusIndicator status={sub.status} />
            <div>
              <p className={cx('font-body-md text-body-md font-medium', sub.status === SUBTOPIC_STATUS.UPCOMING ? 'text-on-surface-variant' : 'text-primary-container')}>
                {sub.title}
              </p>
              <p className={cx('font-citation text-[12px]', isInProgress ? 'text-secondary-container font-bold' : 'text-on-surface-variant')}>
                {sub.meta}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
