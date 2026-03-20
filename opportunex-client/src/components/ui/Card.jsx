const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div
      className={`bg-white border border-stone-100 ${padding ? 'p-6' : ''}
        ${hover ? 'hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-display text-xl font-normal text-stone-900 tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-stone-500 mt-1 leading-relaxed ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-5 pt-5 border-t border-stone-100 ${className}`}>{children}</div>
);

export default Card;
