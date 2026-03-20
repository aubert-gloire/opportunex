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
        <label className="block text-[10px] uppercase tracking-label text-stone-400 font-medium mb-2.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-0 py-3 text-sm text-stone-900 bg-transparent
          border-0 border-b transition-colors duration-150
          focus:outline-none focus:ring-0
          placeholder:text-stone-300
          resize-none leading-relaxed
          ${error
            ? 'border-red-400 focus:border-red-600'
            : 'border-stone-200 focus:border-stone-900'
          }
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
