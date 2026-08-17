import Icon from '../../ui/Icon';
import CitationTagInput from './CitationTagInput';
import AIGenerateButton from './AIGenerateButton';

export default function QuizSettingsPanel({ quiz, onFieldChange, onAddCitation, onRemoveCitation }) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      <div className="bg-surface-container-lowest rounded-xl border border-ink-border shadow-level-1 p-6">
        <h3 className="font-h2 text-h2 text-[18px] font-bold text-primary border-b border-ink-border pb-3 mb-4">
          Quiz Settings
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">XP Reward</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF4E5] flex items-center justify-center border border-saffron">
                <Icon name="stars" size={20} fill className="text-saffron" />
              </div>
              <input
                className="w-24 bg-surface-container-lowest border border-ink-border rounded-lg px-3 py-2 font-citation text-citation text-primary text-center focus:outline-none focus:border-saffron transition-colors"
                type="number"
                value={quiz.xpReward}
                onChange={(e) => onFieldChange('xpReward', Number(e.target.value))}
              />
              <span className="font-body-md text-body-md text-on-surface-variant">Points</span>
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Difficulty Level</label>
            <select
              className="w-full bg-surface-container-lowest border border-ink-border rounded-lg px-3 py-2 font-body-md text-body-md text-primary focus:outline-none focus:border-primary-container transition-colors appearance-none"
              value={quiz.difficulty}
              onChange={(e) => onFieldChange('difficulty', e.target.value)}
            >
              {quiz.difficultyOptions.map((option) => (
                <option key={option}>{option}</option>
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
