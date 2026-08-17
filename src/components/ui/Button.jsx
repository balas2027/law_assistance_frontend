import { forwardRef } from 'react';
import { cx } from '../../lib/utils';

const VARIANTS = {
  primary: 'bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-level-1',
  saffron: 'bg-saffron text-on-primary hover:bg-orange-500 transition-colors shadow-level-1',
  secondary:
    'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors shadow-sm',
  outline:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary/5 transition-colors',
  soft:
    'bg-surface-container border border-outline-variant text-primary-container hover:bg-surface-container-highest transition-colors',
  ghost: 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors',
};

const SIZES = {
  sm: 'px-4 py-2 text-label-caps',
  md: 'px-5 py-2.5 text-body-md',
  lg: 'px-8 py-3.5 text-body-md',
};

const IconButton = forwardRef(function IconButton({ className = '', ...rest }, ref) {
  return (
    <button
      ref={ref}
      className={cx(
        'flex items-center justify-center rounded-full transition-colors',
        className,
      )}
      {...rest}
    />
  );
});

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    icon = null,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-label-caps rounded-full tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-container cursor-pointer',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;
export { IconButton };
