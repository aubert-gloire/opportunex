import { getInitials } from '@/utils/helpers';

const Avatar = ({ src, alt, firstName, lastName, size = 'md', className = '' }) => {
  const sizes = {
    sm:   'w-8 h-8 text-xs',
    md:   'w-10 h-10 text-sm',
    lg:   'w-12 h-12 text-sm',
    xl:   'w-16 h-16 text-base',
    '2xl':'w-24 h-24 text-xl',
  };

  const initials = getInitials(firstName, lastName);

  return (
    <div className={`${sizes[size]} ${className} rounded-full overflow-hidden flex-shrink-0`}>
      {src ? (
        <img
          src={src}
          alt={alt || `${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-primary flex items-center justify-center text-white font-medium">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
