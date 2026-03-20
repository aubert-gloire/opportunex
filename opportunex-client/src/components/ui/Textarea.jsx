import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  required = false,
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-4 py-3 text-base rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
          } focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none leading-relaxed placeholder:text-gray-400 ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
