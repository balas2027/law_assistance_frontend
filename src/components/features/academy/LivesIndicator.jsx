import Icon from '../../ui/Icon';

export default function LivesIndicator({ lives, maxLives }) {
  return (
    <div className="flex items-center gap-2 text-error">
      {Array.from({ length: maxLives }).map((_, i) => (
        <Icon key={i} name="favorite" size={20} fill={i < lives} className={i < lives ? '' : 'text-outline-variant'} />
      ))}
    </div>
  );
}
