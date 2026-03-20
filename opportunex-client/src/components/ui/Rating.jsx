import { Star } from 'lucide-react';

const Rating = ({ rating = 0, maxRating = 5, size = 'md', showNumber = true, onChange, readonly = true }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, i) => {
        const val = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => !readonly && onChange?.(val)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
          >
            <Star
              className={`${sizes[size]} ${val <= rating ? 'fill-accent text-accent' : 'fill-stone-100 text-stone-100'}`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-2 text-xs text-stone-500 font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default Rating;
