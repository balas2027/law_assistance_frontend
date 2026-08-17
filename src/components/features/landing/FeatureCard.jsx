import Icon from '../../ui/Icon';

export default function FeatureCard({ icon, title, description, accent = 'primary', glow = 'saffron' }) {
  const iconWrap =
    accent === 'saffron'
      ? 'bg-saffron/10 group-hover:bg-saffron'
      : 'bg-primary/10 group-hover:bg-primary';
  const iconColor =
    accent === 'saffron' ? 'text-saffron group-hover:text-white' : 'text-primary group-hover:text-white';
  const glowClass = glow === 'saffron' ? 'bg-saffron/5 group-hover:bg-saffron/10' : 'bg-primary/5 group-hover:bg-primary/10';

  return (
    <div className="bg-background rounded-card p-8 border border-surface-variant shadow-level-1 hover:shadow-level-2 transition-shadow group relative overflow-hidden">
      <div className={`w-12 h-12 rounded-full ${iconWrap} flex items-center justify-center mb-6 transition-colors`}>
        <Icon name={icon} size={28} className={`${iconColor} transition-colors`} />
      </div>
      <h3 className="font-h2 text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${glowClass} rounded-full blur-2xl transition-colors`} />
    </div>
  );
}
