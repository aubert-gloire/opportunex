const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${padding ? 'p-6' : ''
        } ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-5 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-xl font-semibold text-gray-900 tracking-tight ${className}`}>{children}</h3>;
};

export const CardDescription = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-600 mt-2 leading-relaxed ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>;
};

export default Card;
