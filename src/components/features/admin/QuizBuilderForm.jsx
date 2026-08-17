import Icon from '../../ui/Icon';
import QuizOptionEditor from './QuizOptionEditor';

export default function QuizBuilderForm({
  quiz,
  onFieldChange,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionScenarioChange,
  onQuestionPointsChange,
  onAddOption,
  onRemoveOption,
  onOptionTextChange,
  onCorrectChange,
}) {
  return (
    <div className="flex-1 w-full min-w-0 space-y-6">
      {/* ── Quiz info card ── */}
      <div className="bg-surface-container-lowest rounded-xl border border-ink-border shadow-level-1 p-6 md:p-8 space-y-8">
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Quiz Title</label>
          <input
            className="w-full bg-surface-container-lowest border border-ink-border rounded-card px-4 py-3 font-body-lg text-body-lg text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
            type="text"
            value={quiz.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="e.g. Constitutional Law Mock Test 1"
          />
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Quiz Description</label>
          <textarea
            className="w-full bg-surface-container-lowest border border-ink-border rounded-card px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors resize-y"
            rows={3}
            value={quiz.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Describe what this mock test covers..."
          />
        </div>
      </div>

      {/* ── Questions ── */}
      {quiz.questions.map((question, qi) => (
        <div
          key={question.key}
          className="bg-surface-container-lowest rounded-xl border border-ink-border shadow-level-1 p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-ink-border pb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold flex items-center justify-center text-sm">
                {qi + 1}
              </span>
              <h3 className="font-h2 text-h2 text-[20px] font-bold text-primary">Question {qi + 1}</h3>
            </div>
            <button
              type="button"
              onClick={() => onRemoveQuestion(question.key)}
              className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-surface-container"
              aria-label={`Remove question ${qi + 1}`}
            >
              <Icon name="delete" size={18} />
            </button>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Scenario / Question</label>
            <textarea
              className="w-full bg-surface-container-lowest border border-ink-border rounded-card px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors resize-y"
              rows={3}
              value={question.scenario}
              onChange={(e) => onQuestionScenarioChange(question.key, e.target.value)}
              placeholder={`Enter question ${qi + 1} text...`}
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Points</label>
            <input
              className="w-28 bg-surface-container-lowest border border-ink-border rounded-lg px-3 py-2 font-body-md text-body-md text-primary text-center focus:outline-none focus:border-primary-container transition-colors"
              type="number"
              min={0}
              value={question.points}
              onChange={(e) => onQuestionPointsChange(question.key, e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Options
              </h4>
              <span className="font-label-caps text-label-caps text-on-surface-variant">Select the correct answer</span>
            </div>
            {question.options.map((option) => (
              <QuizOptionEditor
                key={option.id}
                option={option}
                onTextChange={(optId, text) => onOptionTextChange(question.key, optId, text)}
                onCorrectChange={(optId) => onCorrectChange(question.key, optId)}
                onRemove={question.options.length > 2 ? (optId) => onRemoveOption(question.key, optId) : null}
              />
            ))}
            <button
              type="button"
              onClick={() => onAddOption(question.key)}
              className="flex items-center gap-2 text-primary font-label-caps text-label-caps font-bold hover:text-secondary transition-colors py-2"
            >
              <Icon name="add_circle" size={18} />
              Add Another Option
            </button>
          </div>
        </div>
      ))}

      {/* ── Add question ── */}
      <button
        type="button"
        onClick={onAddQuestion}
        className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-primary font-label-caps text-label-caps font-bold flex items-center justify-center gap-2 hover:border-primary-container hover:bg-surface-container-lowest transition-all"
      >
        <Icon name="add_circle" size={20} />
        Add Question
      </button>
    </div>
  );
}