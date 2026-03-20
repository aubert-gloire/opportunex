import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
    },
  };

  const config = types[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${config.border} ${className}`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h4>}
        {message && <p className={`text-sm ${config.messageColor}`}>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
