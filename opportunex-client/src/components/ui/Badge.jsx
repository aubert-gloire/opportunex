const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary:   'bg-primary-50 text-primary-700',
    accent:    'bg-accent-50 text-accent-700',
    success:   'bg-green-50 text-green-700',
    warning:   'bg-yellow-50 text-yellow-700',
    danger:    'bg-red-50 text-red-700',
    info:      'bg-blue-50 text-blue-700',
    purple:    'bg-purple-50 text-purple-700',
    gray:      'bg-stone-100 text-stone-600',
    secondary: 'bg-stone-100 text-stone-600',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium ${variants[variant] || variants.gray} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
