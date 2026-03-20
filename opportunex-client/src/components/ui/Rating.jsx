import { Star } from 'lucide-react';

const Rating = ({ rating = 0, maxRating = 5, size = 'md', showNumber = true, onChange, readonly = true }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(ratingValue)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
          >
            <Star
              className={`${sizes[size]} ${ratingValue <= rating
                  ? 'fill-accent text-accent'
                  : 'fill-gray-200 text-gray-200'
                }`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
