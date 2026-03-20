import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm:   'max-w-md',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={closeOnOverlayClick ? (e) => e.target === e.currentTarget && onClose() : undefined}
    >
      <div className={`bg-white w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
          <h2 className="font-display text-xl font-normal text-stone-900" style={{ letterSpacing: '-0.016em' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-stone-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
