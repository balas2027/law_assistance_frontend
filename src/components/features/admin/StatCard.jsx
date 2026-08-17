import Icon from '../../ui/Icon';

export default function StatCard({ stat }) {
  const hasTrend = Boolean(stat.trend);
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1 flex flex-col relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
      <Icon name={stat.icon} size={24} className="text-on-surface-variant mb-4" />
      <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">{stat.label}</h3>
      <div className="font-h1 text-h1 text-primary">{stat.value}</div>
      {hasTrend ? (
        <div className="mt-2 text-[12px] font-medium text-tertiary-container flex items-center gap-1">
          <Icon name={stat.trendIcon} size={14} /> {stat.trend}
        </div>
      ) : (
        <div className="mt-2 text-[12px] font-medium text-on-surface-variant flex items-center gap-1">{stat.footnote}</div>
      )}
    </div>
  );
}
