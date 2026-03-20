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
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary active:scale-95',
    accent: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent active:scale-95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary active:scale-95 shadow-none',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-95',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400 shadow-none',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-lg',
    lg: 'px-7 py-3.5 text-lg rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
