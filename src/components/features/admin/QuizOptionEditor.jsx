import { cx } from '../../../lib/utils';

export default function QuizOptionEditor({ option, onTextChange, onCorrectChange }) {
  const isCorrect = option.isCorrect;
  return (
    <div
      className={cx(
        'flex items-start gap-4 p-4 rounded-card border bg-surface-container-lowest',
        isCorrect ? 'border-primary-container bg-[#FAFAF7]' : 'border-[#E7E5DE] hover:bg-[#FAFAF7] transition-colors',
      )}
    >
      <div className="pt-3">
        <input
          type="radio"
          name="correct_answer"
          checked={isCorrect}
          onChange={() => onCorrectChange(option.id)}
          className="w-5 h-5 text-saffron border-outline-variant focus:ring-saffron"
          aria-label={`Mark ${option.label} as correct`}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-citation text-citation text-primary-container bg-surface-container px-2 py-0.5 rounded-sm">
            {option.label}
          </span>
          {isCorrect && (
            <span className="text-xs text-tertiary-container font-bold uppercase tracking-wider">Correct Answer</span>
          )}
        </div>
        <textarea
          className="w-full bg-surface-container-lowest border border-[#E7E5DE] rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-colors"
          rows={2}
          value={option.text}
          onChange={(e) => onTextChange(option.id, e.target.value)}
          placeholder={`Enter ${option.label} text...`}
        />
      </div>
    </div>
  );
}
