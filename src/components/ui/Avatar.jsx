import { cx } from '../../lib/utils';

const SIZES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export default function Avatar({ src = null, name = 'U', size = 'md', className = '', ...rest }) {
  return (
    <div
      className={cx(
        'rounded-full overflow-hidden bg-primary flex items-center justify-center text-white font-bold border-2 border-primary-fixed shrink-0',
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{typeof name === 'string' ? name.charAt(0).toUpperCase() : name}</span>
      )}
    </div>
  );
}
