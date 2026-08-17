import { forwardRef } from 'react';
import Icon from '../ui/Icon';

const SearchBar = forwardRef(function SearchBar({ className = '', placeholder = 'Search...', ...rest }, ref) {
  return (
    <div className={`relative ${className}`}>
      <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      <input
        ref={ref}
        className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-card focus:border-primary-container focus:ring-0 text-body-md font-body-md transition-colors placeholder:text-on-surface-variant"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
});

export default SearchBar;
