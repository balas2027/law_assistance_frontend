import Icon from '../../ui/Icon';
import CitationTagInput from './CitationTagInput';
import AIGenerateButton from './AIGenerateButton';

export default function QuizSettingsPanel({ quiz, topics, onFieldChange, onAddCitation, onRemoveCitation }) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      <div className="bg-white rounded-sm border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
        <h3 className="text-[17px] font-bold text-gray-950 border-b border-gray-100 pb-3 mb-5">
          Quiz Settings
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subject / Topic *</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-sm px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0] transition-colors"
              value={quiz.topicId ?? ''}
              onChange={(e) => onFieldChange('topicId', Number(e.target.value))}
            >
              <option value="" disabled>Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">XP Reward Per Question</label>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-amber-50 flex items-center justify-center border border-amber-200 shrink-0 text-amber-600">
                <Icon name="stars" size={20} fill />
              </div>
              <input
                className="w-24 bg-white border border-gray-300 rounded-sm px-3 py-2 text-[14px] font-bold text-gray-900 text-center focus:outline-none focus:border-[#0b57d0] transition-colors"
                type="number"
                value={quiz.xpReward}
                onChange={(e) => onFieldChange('xpReward', Number(e.target.value))}
              />
              <span className="text-[13px] text-gray-500 font-semibold">XP</span>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Max Lives Allowed</label>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-red-50 flex items-center justify-center border border-red-200 shrink-0 text-red-600">
                <Icon name="favorite" size={20} fill />
              </div>
              <input
                className="w-24 bg-white border border-gray-300 rounded-sm px-3 py-2 text-[14px] font-bold text-gray-900 text-center focus:outline-none focus:border-[#0b57d0] transition-colors"
                type="number"
                min={1}
                value={quiz.maxLives}
                onChange={(e) => onFieldChange('maxLives', Number(e.target.value))}
              />
              <span className="text-[13px] text-gray-500 font-semibold">Hearts</span>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Difficulty Level</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-sm px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0] transition-colors"
              value={quiz.difficulty}
              onChange={(e) => onFieldChange('difficulty', e.target.value)}
            >
              {quiz.difficultyOptions.map((option) => (
                <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
              ))}
            </select>
          </div>

          <CitationTagInput
            citations={quiz.citations}
            onAdd={onAddCitation}
            onRemove={onRemoveCitation}
          />

          <AIGenerateButton />
        </div>
      </div>
    </div>
  );
}
