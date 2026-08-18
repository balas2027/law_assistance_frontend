import { cx } from '../../../lib/utils';
import Icon from '../../ui/Icon';

export default function QuizOptionEditor({ option, onTextChange, onCorrectChange, onRemove = null }) {
  const isCorrect = option.isCorrect;
  return (
    <div
      className={cx(
        'flex items-start gap-4 p-4 rounded-sm border bg-white transition-all',
        isCorrect ? 'border-[#0b57d0] ring-1 ring-[#0b57d0]/20 bg-[#fafbfc]' : 'border-gray-300 hover:border-gray-400',
      )}
    >
      <div className="pt-2.5">
        <input
          type="radio"
          name="correct_answer"
          checked={isCorrect}
          onChange={() => onCorrectChange(option.id)}
          className="w-4 h-4 text-[#0b57d0] border-gray-300 focus:ring-[#0b57d0] cursor-pointer"
          aria-label={`Mark ${option.label} as correct`}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-bold text-[#0b57d0] bg-[#eaf1fc] px-2 py-0.5 rounded-sm">
            {option.label}
          </span>
          {isCorrect && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
              Correct Answer
            </span>
          )}
        </div>
        <textarea
          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0] transition-colors leading-relaxed"
          rows={2}
          value={option.text}
          onChange={(e) => onTextChange(option.id, e.target.value)}
          placeholder={`Enter option ${option.label} text...`}
        />
      </div>
      {onRemove && (
        <button
          className="pt-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          onClick={() => onRemove(option.id)}
          aria-label={`Remove ${option.label}`}
          type="button"
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}