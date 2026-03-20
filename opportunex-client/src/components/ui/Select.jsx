import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] uppercase tracking-label text-stone-400 font-medium mb-2.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-0 py-3 text-sm bg-transparent
          border-0 border-b transition-colors duration-150
          focus:outline-none focus:ring-0
          appearance-none cursor-pointer
          ${error
            ? 'border-red-400 text-red-900 focus:border-red-600'
            : 'border-stone-200 text-stone-900 focus:border-stone-900'
          }
          ${className}`}
        {...props}
      >
        <option value="" className="text-stone-300">{placeholder}</option>
        {options.map((option) => (
          <option
            key={typeof option === 'string' ? option : option.value}
            value={typeof option === 'string' ? option : option.value}
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
