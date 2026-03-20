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
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-3 text-base rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
          } focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={typeof option === 'string' ? option : option.value}
            value={typeof option === 'string' ? option : option.value}
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
