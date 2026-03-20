import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-l-2 border-green-500',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-l-2 border-red-500',
      icon: <XCircle className="w-4 h-4 text-red-600" />,
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-l-2 border-yellow-500',
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      titleColor: 'text-yellow-900',
      messageColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-stone-50',
      border: 'border-l-2 border-primary',
      icon: <Info className="w-4 h-4 text-primary" />,
      titleColor: 'text-stone-900',
      messageColor: 'text-stone-600',
    },
  };

  const config = types[type];

  return (
    <div className={`flex items-start gap-3 p-4 ${config.bg} ${config.border} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={`text-sm font-medium ${config.titleColor} mb-0.5`}>{title}</h4>
        )}
        {message && (
          <p className={`text-sm font-light ${config.messageColor}`}>{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-stone-300 hover:text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const AlertTitle = ({ children, className = '' }) => (
  <p className={`text-sm font-medium text-stone-900 ${className}`}>{children}</p>
);

export const AlertDescription = ({ children, className = '' }) => (
  <p className={`text-sm font-light text-stone-600 mt-0.5 ${className}`}>{children}</p>
);

export default Alert;
