import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const base = [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-150',
    'focus:outline-none',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'text-[11px] uppercase tracking-label',
  ].join(' ');

  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-700 active:scale-[0.99]',
    accent:    'bg-accent text-white hover:bg-accent-600 active:scale-[0.99]',
    secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200',
    outline:   'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
    danger:    'bg-red-600 text-white hover:bg-red-700',
    success:   'bg-green-700 text-white hover:bg-green-800',
    ghost:     'text-stone-600 hover:text-stone-900',
  };

  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
