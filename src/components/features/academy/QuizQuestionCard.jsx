import Icon from '../../ui/Icon';

export default function QuizQuestionCard({ scenario }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-level-1 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-8 w-16 h-1 bg-primary" />
      <div className="flex items-start gap-4">
        <Icon name="gavel" size={32} fill className="text-primary mt-1" />
        <div>
          <h3 className="font-h2 text-h2 text-primary mb-2">Case Scenario</h3>
          <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">{scenario}</p>
        </div>
      </div>
    </div>
  );
}