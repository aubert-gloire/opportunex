import { getInitials } from '@/utils/helpers';

const Avatar = ({ src, alt, firstName, lastName, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const initials = getInitials(firstName, lastName);

  return (
    <div className={`${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || `${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover border-2 border-gray-200"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold border-2 border-gray-200">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
