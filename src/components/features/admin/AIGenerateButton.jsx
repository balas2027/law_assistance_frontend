import Icon from '../../ui/Icon';

export default function AIGenerateButton() {
  return (
    <div className="pt-4 border-t border-ink-border">
      <button className="w-full flex items-center justify-center gap-2 bg-surface-container border border-primary-container text-primary-container py-2 rounded-lg font-label-caps text-label-caps hover:bg-surface-variant transition-colors">
        <Icon name="auto_awesome" size={16} />
        AI Generate Explanations
      </button>
    </div>
  );
}
