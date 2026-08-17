import Icon from '../../ui/Icon';
import QuizOptionEditor from './QuizOptionEditor';

export default function QuizBuilderForm({ quiz, onFieldChange, onOptionTextChange, onCorrectChange, onAddOption }) {
  return (
    <div className="flex-1 w-full bg-surface-container-lowest rounded-xl border border-ink-border shadow-level-1 p-6 md:p-8 space-y-8">
      <div>
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Question Title</label>
        <input
          className="w-full bg-surface-container-lowest border border-ink-border rounded-card px-4 py-3 font-body-lg text-body-lg text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
          type="text"
          value={quiz.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Case Description</label>
        <textarea
          className="w-full bg-surface-container-lowest border border-ink-border rounded-card px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors resize-y"
          rows={5}
          value={quiz.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-ink-border pb-2">
          <h3 className="font-h2 text-h2 text-[20px] font-bold text-primary">Multiple Choice Options</h3>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Select correct answer</span>
        </div>
        {quiz.options.map((option) => (
          <QuizOptionEditor
            key={option.id}
            option={option}
            onTextChange={onOptionTextChange}
            onCorrectChange={onCorrectChange}
          />
        ))}
      </div>

      <button
        onClick={onAddOption}
        className="flex items-center gap-2 text-primary font-label-caps text-label-caps font-bold hover:text-secondary transition-colors py-2"
      >
        <Icon name="add_circle" size={18} />
        Add Another Option
      </button>
    </div>
  );
}
