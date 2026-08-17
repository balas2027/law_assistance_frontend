import Icon from '../../ui/Icon';
import { cx } from '../../../lib/utils';

export default function QuizOptionItem({ option, selected = false, onSelect = () => {} }) {
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={cx(
        'w-full text-left rounded-xl p-5 flex items-center gap-4 transition-all group relative overflow-hidden',
        selected
          ? 'bg-surface border-2 border-secondary-container shadow-level-1'
          : 'bg-surface-container-lowest border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low',
      )}
    >
      {selected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container" />}
      <div
        className={cx(
          'w-8 h-8 rounded-full flex items-center justify-center font-label-caps shrink-0',
          selected
            ? 'bg-secondary-container text-on-secondary-container border border-secondary-container'
            : 'border border-outline-variant text-on-surface-variant group-hover:border-primary-fixed-dim',
        )}
      >
        {option.id}
      </div>
      <span className={cx('font-body-md text-body-md flex-1', selected ? 'text-primary font-medium' : 'text-on-surface')}>
        {option.text}
      </span>
      {selected && <Icon name="check_circle" size={20} className="text-secondary-container ml-auto shrink-0" />}
    </button>
  );
}