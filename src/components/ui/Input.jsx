import { forwardRef } from 'react';
import { cx } from '../../lib/utils';

const Input = forwardRef(function Input({ className = '', label = null, icon = null, error = null, ...rest }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={rest.id}
          className="block font-label-caps text-label-caps text-primary mb-2 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline-variant text-[20px]">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={cx(
            'block w-full px-4 py-3 border border-[#E7E5DE] rounded-card bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant',
            'focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-colors',
            icon && 'pl-10',
            error && 'border-error',
            className,
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
});

export default Input;
