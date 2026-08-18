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
      <div className="bg-white rounded-sm border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quiz Title *</label>
          <input
            className="w-full bg-white border border-gray-300 rounded-sm px-4 py-3 text-[18px] font-bold text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors shadow-2xs"
            type="text"
            value={quiz.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="e.g. Constitutional Law Mock Test 1"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quiz Description</label>
          <textarea
            className="w-full bg-white border border-gray-300 rounded-sm px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors resize-y shadow-2xs leading-relaxed"
            rows={3}
            value={quiz.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Describe what this mock test covers, landmark cases tested, etc..."
          />
        </div>
      </div>

      {/* ── Questions ── */}
      {quiz.questions.map((question, qi) => (
        <div
          key={question.key}
          className="bg-white rounded-sm border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0b57d0] text-white font-bold flex items-center justify-center text-[12px] shadow-xs">
                {qi + 1}
              </span>
              <h3 className="text-[17px] font-bold text-gray-950">Question {qi + 1}</h3>
            </div>
            <button
              type="button"
              onClick={() => onRemoveQuestion(question.key)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-sm hover:bg-red-50 cursor-pointer"
              aria-label={`Remove question ${qi + 1}`}
            >
              <Icon name="delete" size={18} />
            </button>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Scenario / Question Text *</label>
            <textarea
              className="w-full bg-white border border-gray-300 rounded-sm px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors resize-y shadow-2xs leading-relaxed"
              rows={3}
              value={question.scenario}
              onChange={(e) => onQuestionScenarioChange(question.key, e.target.value)}
              placeholder={`Enter scenario or question text for question ${qi + 1}...`}
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Points for Correct Answer</label>
            <input
              className="w-28 bg-white border border-gray-300 rounded-sm px-3 py-2 text-[14px] font-bold text-gray-900 text-center focus:outline-none focus:border-[#0b57d0] transition-colors"
              type="number"
              min={0}
              value={question.points}
              onChange={(e) => onQuestionPointsChange(question.key, e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                Options
              </h4>
              <span className="text-[12px] text-gray-500 font-semibold">Select the correct radio option</span>
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
              className="flex items-center gap-2 text-[#0b57d0] text-[13px] font-bold tracking-wider uppercase hover:text-[#0842a0] transition-colors py-2 cursor-pointer"
            >
              <Icon name="add_circle" size={18} />
              <span>Add Another Option</span>
            </button>
          </div>
        </div>
      ))}

      {/* ── Add question ── */}
      <button
        type="button"
        onClick={onAddQuestion}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-sm text-[#0b57d0] font-bold text-[13px] tracking-wider uppercase flex items-center justify-center gap-2 hover:border-[#0b57d0] hover:bg-[#eaf1fc]/40 transition-all cursor-pointer shadow-xs"
      >
        <Icon name="add_circle" size={20} />
        <span>Add Question</span>
      </button>
    </div>
  );
}